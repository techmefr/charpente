import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const origin = process.env.SITE_ORIGIN ?? 'http://127.0.0.1:4330'
const base = '/charpente'
const shotsDir = process.env.SHOTS_DIR
const slugs = [
  '',
  'getting-started',
  'themes',
  'motions',
  'configuration',
  'calendar',
  'create-a-theme',
  'playground',
  'accessibility',
]
const urlOf = (slug) => `${origin}${base}/${slug === '' ? '' : `${slug}/`}`

const failures = []
const fail = (message) => {
  failures.push(message)
  console.error(`FAIL ${message}`)
}

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const checked = new Map()

const status = async (url) => {
  if (!checked.has(url)) {
    const response = await context.request.get(url)
    checked.set(url, response.status())
  }
  return checked.get(url)
}

for (const slug of slugs) {
  const page = await context.newPage()
  const url = urlOf(slug)
  const problems = []
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      problems.push(`console ${message.type()}: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
  page.on('response', (response) => {
    if (response.status() >= 400) problems.push(`HTTP ${response.status()} ${response.url()}`)
  })

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)

  const refs = await page.evaluate(() => {
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

  const ids = await page.evaluate(() => [...document.querySelectorAll('[id]')].map((e) => e.id))
  for (const ref of refs) {
    if (ref.raw.startsWith('#')) {
      if (ref.raw.length > 1 && !ids.includes(ref.raw.slice(1))) fail(`${slug || '/'}: anchor ${ref.raw} missing`)
      continue
    }
    if (/^(mailto:|data:)/.test(ref.raw)) continue
    const parsed = new URL(ref.resolved)
    if (parsed.origin !== origin) continue
    if (!parsed.pathname.startsWith(`${base}/`)) fail(`${slug || '/'}: link outside base ${ref.raw}`)
    const target = `${parsed.origin}${parsed.pathname}`
    const code = await status(target)
    if (code !== 200) fail(`${slug || '/'}: ${ref.raw} returns ${code}`)
    if (parsed.hash) {
      const body = await (await context.request.get(target)).text()
      if (!body.includes(`id="${parsed.hash.slice(1)}"`)) fail(`${slug || '/'}: anchor ${ref.raw} missing from target`)
    }
  }

  for (const problem of problems) fail(`${slug || '/'}: ${problem}`)
  console.log(`ok ${slug || '/'} (${refs.length} references)`)
  await page.close()
}

const expect = (condition, message) => {
  if (!condition) fail(message)
  else console.log(`ok ${message}`)
}

const playground = await context.newPage()
const playgroundErrors = []
playground.on('pageerror', (error) => playgroundErrors.push(error.message))
await playground.goto(urlOf('playground'), { waitUntil: 'networkidle' })
await playground.waitForTimeout(400)

const leaf = playground.locator('#pg-root .kpi__value').first()
const root = playground.locator('#pg-root')
const style = (property) => leaf.evaluate((element, name) => getComputedStyle(element)[name], property)

const solidImage = await style('backgroundImage')
expect((await style('animationName')).includes('charpente-shimmer'), 'playground: shimmer active by default')

await playground.selectOption('#pg-theme', 'cyberpunk')
const cyberImage = await style('backgroundImage')
expect(cyberImage !== solidImage && cyberImage.includes('repeating-linear-gradient'), 'playground: theme changes the computed background')
expect((await root.getAttribute('data-charpente-theme')) === 'cyberpunk', 'playground: data-charpente-theme attribute set')

await playground.uncheck('#pg-motions input[value="shimmer"]')
await playground.check('#pg-motions input[value="wave"]')
await playground.check('#pg-motions input[value="pulse"]')
const names = await style('animationName')
expect(names.includes('charpente-pulse') && names.includes('charpente-wave') && !names.includes('shimmer'), `playground: pulse + wave motions applied (${names})`)
expect((await root.getAttribute('data-charpente-motion')) === 'pulse wave', 'playground: names sorted and separated by a space')

await playground.uncheck('#pg-motions input[value="pulse"]')
await playground.uncheck('#pg-motions input[value="wave"]')
expect((await root.getAttribute('data-charpente-motion')) === 'none', 'playground: no motion gives none')
expect(!(await style('animationName')).includes('charpente-wave'), 'playground: none removes the animations')

await playground.check('#pg-motions input[value="glitch"]')
await playground.check('#pg-motions input[value="shimmer"]')
expect((await style('animationName')).includes('charpente-glitch'), 'playground: glitch + shimmer applied')

await playground.locator('#pg-delay').fill('500')
expect((await style('animationDelay')).includes('0.5s'), `playground: 500 ms delay applied (${await style('animationDelay')})`)
await playground.locator('#pg-stagger').fill('100')
expect((await root.evaluate((e) => e.style.getPropertyValue('--charpente-stagger'))) === '100ms', 'playground: stagger set as inline style')

await playground.click('#pg-toggle')
expect((await root.getAttribute('data-charpente-loading')) === null, 'playground: switching to loaded removes data-charpente-loading')
expect((await root.getAttribute('aria-busy')) === null && (await root.getAttribute('inert')) === null, 'playground: aria-busy and inert removed')
expect((await style('backgroundImage')) === 'none', 'playground: no paint once loaded')
await playground.click('#pg-toggle')
expect((await root.getAttribute('data-charpente-loading')) !== null && (await root.getAttribute('inert')) !== null, 'playground: back to loading')
expect((await style('backgroundImage')) !== 'none', 'playground: paint is back')

const baseLight = await root.evaluate((e) => getComputedStyle(e).getPropertyValue('--charpente-base').trim())
await playground.click('header [data-scheme-toggle]')
expect((await playground.evaluate(() => document.documentElement.dataset.theme)) === 'dark', 'playground: switches to dark')
const baseDark = await root.evaluate((e) => getComputedStyle(e).getPropertyValue('--charpente-base').trim())
expect(baseDark !== baseLight, `playground: dark tokens active (${baseLight} -> ${baseDark})`)
for (const error of playgroundErrors) fail(`playground: ${error}`)
await playground.close()

const gallery = await context.newPage()
await gallery.goto(urlOf('themes'), { waitUntil: 'networkidle' })
const roots = gallery.locator('#gallery .sample')
expect((await roots.count()) === 35, "themes: 35 themes rendered")
const images = new Set()
for (let index = 0; index < 35; index++) {
  images.add(await roots.nth(index).locator('.sample__name').evaluate((e) => getComputedStyle(e).backgroundImage))
}
expect(images.size === 35, `themes: 35 distinct text paints (${images.size})`)
await gallery.selectOption('#gallery-motion', 'glitch')
expect((await roots.first().locator('.sample__name').evaluate((e) => getComputedStyle(e).animationName)).includes('charpente-glitch'), 'themes: global motion selector')
await gallery.close()

if (shotsDir) {
  mkdirSync(shotsDir, { recursive: true })
  const targets = ['', 'themes', 'playground', 'configuration', 'motions', 'create-a-theme', 'accessibility', 'calendar', 'getting-started']
  const sizes = { desk: { width: 1280, height: 900 }, phone: { width: 390, height: 844 } }
  for (const scheme of ['light', 'dark']) {
    for (const [label, viewport] of Object.entries(sizes)) {
      const shotContext = await browser.newContext({ viewport })
      await shotContext.addInitScript((value) => localStorage.setItem('charpente-scheme', value), scheme)
      for (const slug of targets) {
        const page = await shotContext.newPage()
        await page.goto(urlOf(slug), { waitUntil: 'networkidle' })
        await page.waitForTimeout(500)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
        if (overflow) fail(`${slug || '/'} ${label} ${scheme}: horizontal page scroll`)
        await page.screenshot({ path: `${shotsDir}/${slug || 'accueil'}-${label}-${scheme}.png`, fullPage: true })
        await page.close()
      }
      await shotContext.close()
    }
  }
}

await browser.close()
if (failures.length > 0) {
  console.error(`${failures.length} failure(s)`)
  process.exit(1)
}
console.log('all good')
