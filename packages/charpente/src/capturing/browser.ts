import type { BonesData, CaptureConfig, ZoneBones } from '../types'
import { MEASURE_SCRIPT } from './measure-script'

const DEFAULT_BREAKPOINTS = [375, 768, 1280]
const DEFAULT_WAIT = 500
const VIEWPORT_HEIGHT = 900

interface BrowserHandle {
  newPage: () => Promise<PageHandle>
  close: () => Promise<void>
}

interface PageHandle {
  setViewportSize: (size: { width: number; height: number }) => Promise<void>
  goto: (url: string, options: { waitUntil: string }) => Promise<unknown>
  waitForTimeout: (milliseconds: number) => Promise<void>
  evaluate: <Result>(script: string) => Promise<Result>
}

const PLAYWRIGHT = 'playwright'

const launchBrowser = async (): Promise<BrowserHandle> => {
  const module = (await import(PLAYWRIGHT).catch(() => undefined)) as { chromium: { launch: () => Promise<BrowserHandle> } } | undefined
  if (!module) throw new Error('charpente: capture needs Playwright, install it with "pnpm add -D playwright"')
  return module.chromium.launch()
}

const merge = (data: BonesData, zones: Record<string, ZoneBones>, breakpoint: number): void => {
  for (const [name, zone] of Object.entries(zones)) {
    data[name] = { ...data[name], [String(breakpoint)]: zone }
  }
}

const capturePage = async (page: PageHandle, url: string, breakpoint: number, wait: number): Promise<Record<string, ZoneBones>> => {
  await page.setViewportSize({ width: breakpoint, height: VIEWPORT_HEIGHT })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(wait)
  return page.evaluate<Record<string, ZoneBones>>(MEASURE_SCRIPT)
}

export const captureBones = async (origin: string, config: CaptureConfig): Promise<BonesData> => {
  const breakpoints = [...(config.breakpoints ?? DEFAULT_BREAKPOINTS)].sort((a, b) => a - b)
  const browser = await launchBrowser()
  const data: BonesData = {}
  try {
    const page = await browser.newPage()
    for (const route of config.routes) {
      for (const breakpoint of breakpoints) {
        const url = new URL(route, origin).toString()
        merge(data, await capturePage(page, url, breakpoint, config.wait ?? DEFAULT_WAIT), breakpoint)
      }
    }
  } finally {
    await browser.close()
  }
  return data
}
