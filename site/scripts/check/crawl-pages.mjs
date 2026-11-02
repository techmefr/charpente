import { fail } from './reporting.mjs'
import { base, origin, slugs, urlOf } from './site-urls.mjs'

const checked = new Map()

const statusOf = async (context, url) => {
  if (!checked.has(url)) {
    const response = await context.request.get(url)
    checked.set(url, response.status())
  }
  return checked.get(url)
}

const collectReferences = (page) =>
  page.evaluate(() => {
    const out = []
    for (const [selector, attribute] of [
      ['a[href]', 'href'],
      ['link[href]', 'href'],
      ['script[src]', 'src'],
      ['img[src]:not([src^="data:"])', 'src'],
    ]) {
      for (const element of document.querySelectorAll(selector)) {
        out.push({ raw: element.getAttribute(attribute), resolved: element[attribute] })
      }
    }
    return out
  })

const collectIds = (page) => page.evaluate(() => [...document.querySelectorAll('[id]')].map((e) => e.id))

const checkExternalTarget = async (context, label, ref) => {
  const parsed = new URL(ref.resolved)
  if (parsed.origin !== origin) return
  if (!parsed.pathname.startsWith(`${base}/`)) fail(`${label}: link outside base ${ref.raw}`)
  const target = `${parsed.origin}${parsed.pathname}`
  const code = await statusOf(context, target)
  if (code !== 200) fail(`${label}: ${ref.raw} returns ${code}`)
  if (parsed.hash) {
    const body = await (await context.request.get(target)).text()
    if (!body.includes(`id="${parsed.hash.slice(1)}"`)) fail(`${label}: anchor ${ref.raw} missing from target`)
  }
}

const checkReference = async (context, label, ids, ref) => {
  if (ref.raw.startsWith('#')) {
    if (ref.raw.length > 1 && !ids.includes(ref.raw.slice(1))) fail(`${label}: anchor ${ref.raw} missing`)
    return
  }
  if (/^(mailto:|data:)/.test(ref.raw)) return
  await checkExternalTarget(context, label, ref)
}

const watchProblems = (page, problems) => {
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      problems.push(`console ${message.type()}: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
  page.on('response', (response) => {
    if (response.status() >= 400) problems.push(`HTTP ${response.status()} ${response.url()}`)
  })
}

const crawlPage = async (context, slug) => {
  const page = await context.newPage()
  const label = slug || '/'
  const problems = []
  watchProblems(page, problems)

  await page.goto(urlOf(slug), { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)

  const refs = await collectReferences(page)
  const ids = await collectIds(page)
  for (const ref of refs) await checkReference(context, label, ids, ref)

  for (const problem of problems) fail(`${label}: ${problem}`)
  console.log(`ok ${label} (${refs.length} references)`)
  await page.close()
}

export const crawlPages = async (context) => {
  for (const slug of slugs) await crawlPage(context, slug)
}
