import { mkdirSync } from 'node:fs'
import { chromium, type Page } from 'playwright'
import targets from './targets.json' with { type: 'json' }

interface Target {
  name: string
  url: string
  simple: string
  complex: string
}

const THEMES = [
  'solid',
  'outline',
  'dots',
  'cyberpunk',
  'web',
  'halloween',
  'christmas',
  'winter',
  'summer',
  'spring',
  'autumn',
  'new-year',
  'paper',
  'glass',
  'blueprint',
  'halftone',
  'stripes',
  'scanline',
  'neon',
  'aurora',
  'brutalist',
  'sketch',
  'topo',
  'waves',
  'valentine',
  'birthday',
  'pride',
  'editorial',
  'commerce',
  'analytics',
  'gaming',
  'music',
  'developer',
  'travel',
  'wellness',
]
const PAGES = ['simple', 'complex'] as const
const ROOT = '[data-testid="root"]'
const SETTLE_MS = 1500
const GEOMETRY_TOLERANCE = 1
const MAX_REPORTED = 4

const only = process.argv[2]

const snapshot = (page: Page): Promise<number[][]> =>
  page.$$eval(`${ROOT}, ${ROOT} *`, (elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect()
      return [rect.x, rect.y, rect.width, rect.height]
    }),
  )

const geometryProblems = (loaded: number[][], loading: number[][]): string[] => {
  if (loaded.length !== loading.length) {
    return [`element count differs: ${loaded.length} loaded, ${loading.length} loading`]
  }
  const problems: string[] = []
  loaded.forEach((box, index) => {
    const other = loading[index] as number[]
    const moved = box.some((value, axis) => Math.abs(value - (other[axis] as number)) > GEOMETRY_TOLERANCE)
    if (moved) problems.push(`box #${index} moved from [${box.map(Math.round)}] to [${other.map(Math.round)}]`)
  })
  return problems
}

const paintProblems = (page: Page): Promise<string[]> =>
  page.evaluate((rootSelector) => {
    const root = document.querySelector(rootSelector) as Element
    const problems: string[] = []
    const label = (element: Element): string =>
      `${element.tagName.toLowerCase()}${element.className ? `.${String(element.className).split(' ')[0]}` : ''}`

    for (const element of [root, ...root.querySelectorAll('*')]) {
      for (const node of element.childNodes) {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue
        const fill = getComputedStyle(element).getPropertyValue('-webkit-text-fill-color')
        if (fill !== 'rgba(0, 0, 0, 0)') problems.push(`visible text in ${label(element)}: "${node.textContent.trim().slice(0, 24)}"`)
      }
    }

    const skipped = ['option', 'br', 'source', 'script', 'style']
    for (const element of root.querySelectorAll('*')) {
      const tag = element.tagName.toLowerCase()
      if (element.children.length > 0 || skipped.includes(tag)) continue
      if (tag !== 'svg' && element.closest('svg')) continue
      if (element instanceof HTMLInputElement && ['checkbox', 'radio'].includes(element.type)) continue
      const rect = element.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) continue
      const style = getComputedStyle(element)
      if (!style.backgroundImage.includes('gradient')) problems.push(`unpainted leaf ${label(element)}`)
      if (style.visibility === 'hidden') problems.push(`hidden leaf ${label(element)}`)
    }
    return problems
  }, ROOT)

const stateProblems = (page: Page): Promise<string[]> =>
  page.evaluate((rootSelector) => {
    const root = document.querySelector(rootSelector) as HTMLElement
    const problems: string[] = []
    if (!root.hasAttribute('data-charpente-loading')) problems.push('root has no data-charpente-loading')
    if (root.getAttribute('aria-busy') !== 'true') problems.push('root has no aria-busy="true"')
    if (!root.hasAttribute('inert')) problems.push('root is not inert')
    return problems
  }, ROOT)

const run = async (): Promise<void> => {
  const browser = await chromium.launch()
  let failures = 0

  for (const target of (targets as Target[]).filter((entry) => !only || entry.name === only)) {
    for (const pageName of PAGES) {
      const problems: string[] = []
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
      const page = await context.newPage()
      page.on('pageerror', (error) => problems.push(`page error: ${error.message}`))
      page.on('console', (message) => {
        const text = message.text()
        if (text.includes('Failed to load resource')) return
        if (message.type() === 'error' || /hydrat/i.test(text)) problems.push(`console ${message.type()}: ${text.slice(0, 140)}`)
      })

      const address = `${target.url}${target[pageName]}`
      try {
        await page.goto(`${address}?state=loaded`, { waitUntil: 'networkidle' })
        await page.waitForSelector(ROOT, { timeout: 8000 })
        await page.waitForTimeout(400)
        const loaded = await snapshot(page)

        await page.goto(`${address}?state=loading`, { waitUntil: 'networkidle' })
        await page.waitForSelector(ROOT, { timeout: 8000 })
        await page.waitForTimeout(SETTLE_MS)
        problems.push(...(await stateProblems(page)))
        problems.push(...geometryProblems(loaded, await snapshot(page)).slice(0, MAX_REPORTED))

        mkdirSync(`screenshots/${target.name}`, { recursive: true })
        for (const theme of THEMES) {
          await page.evaluate(
            ([selector, name]) => document.querySelector(selector as string)?.setAttribute('data-charpente-theme', name as string),
            [ROOT, theme],
          )
          await page.waitForTimeout(250)
          const themed = await paintProblems(page)
          problems.push(...themed.slice(0, MAX_REPORTED).map((problem) => `[${theme}] ${problem}`))
          await page.screenshot({ path: `screenshots/${target.name}/${pageName}-${theme}.png`, fullPage: true })
        }
      } catch (error) {
        problems.push(`run failed: ${(error as Error).message.split('\n')[0]}`)
      }

      const unique = [...new Set(problems)]
      failures += unique.length > 0 ? 1 : 0
      console.log(`${unique.length === 0 ? 'PASS' : 'FAIL'}  ${target.name.padEnd(8)} ${pageName}`)
      for (const problem of unique.slice(0, 12)) console.log(`        ${problem}`)
      await context.close()
    }
  }

  await browser.close()
  process.exit(failures === 0 ? 0 : 1)
}

await run()
