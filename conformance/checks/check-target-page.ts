import { mkdirSync } from 'node:fs'
import type { Browser, Page } from 'playwright'
import { geometryProblems, snapshot } from './geometry-problems.ts'
import { paintProblems } from './paint-problems.ts'
import { MAX_REPORTED, ROOT, SETTLE_MS, THEMES, type Target } from './settings.ts'
import { stateProblems } from './state-problems.ts'

const watchPage = (page: Page, problems: string[]): void => {
  page.on('pageerror', (error) => problems.push(`page error: ${error.message}`))
  page.on('console', (message) => {
    const text = message.text()
    if (text.includes('Failed to load resource')) return
    if (message.type() === 'error' || /hydrat/i.test(text)) problems.push(`console ${message.type()}: ${text.slice(0, 140)}`)
  })
}

const checkThemes = async (page: Page, problems: string[], target: Target, pageName: string): Promise<void> => {
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
}

const checkLoadedThenLoading = async (page: Page, problems: string[], address: string): Promise<void> => {
  await page.goto(`${address}?state=loaded`, { waitUntil: 'networkidle' })
  await page.waitForSelector(ROOT, { timeout: 8000 })
  await page.waitForTimeout(400)
  const loaded = await snapshot(page)

  await page.goto(`${address}?state=loading`, { waitUntil: 'networkidle' })
  await page.waitForSelector(ROOT, { timeout: 8000 })
  await page.waitForTimeout(SETTLE_MS)
  problems.push(...(await stateProblems(page)))
  problems.push(...geometryProblems(loaded, await snapshot(page)).slice(0, MAX_REPORTED))
}

export const checkTargetPage = async (browser: Browser, target: Target, pageName: 'simple' | 'complex'): Promise<string[]> => {
  const problems: string[] = []
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await context.newPage()
  watchPage(page, problems)

  try {
    await checkLoadedThenLoading(page, problems, `${target.url}${target[pageName]}`)
    await checkThemes(page, problems, target, pageName)
  } catch (error) {
    problems.push(`run failed: ${(error as Error).message.split('\n')[0]}`)
  }

  await context.close()
  return [...new Set(problems)]
}
