import type { BonesData, CaptureConfig, ZoneBones } from '../types'
import { MEASURE_SCRIPT } from './measure-script'

const DEFAULT_BREAKPOINTS = [375, 768, 1280]
const DEFAULT_WAIT = 500
const VIEWPORT_HEIGHT = 900

interface BrowserHandle {
  newPage: () => Promise<PageHandle>
  close: () => Promise<void>
}

interface ConnectedBrowser {
  contexts: () => { newPage: () => Promise<PageHandle> }[]
  close: () => Promise<void>
}

interface PlaywrightModule {
  chromium: {
    launch: () => Promise<BrowserHandle>
    connectOverCDP: (endpoint: string) => Promise<ConnectedBrowser>
  }
}

interface PageHandle {
  setViewportSize: (size: { width: number; height: number }) => Promise<void>
  goto: (url: string, options: { waitUntil: string }) => Promise<unknown>
  waitForTimeout: (milliseconds: number) => Promise<void>
  evaluate: <Result>(script: string) => Promise<Result>
  close: () => Promise<void>
}

const PLAYWRIGHT = 'playwright'

const launchBrowser = async (cdp?: string): Promise<BrowserHandle> => {
  const module = (await import(PLAYWRIGHT).catch(() => undefined)) as PlaywrightModule | undefined
  if (!module) throw new Error('charpente: capture needs Playwright, install it with "pnpm add -D playwright"')
  if (!cdp) return module.chromium.launch()
  const browser = await module.chromium.connectOverCDP(cdp)
  const context = browser.contexts()[0]
  if (!context) throw new Error(`charpente: no browser context found at ${cdp}`)
  return { newPage: () => context.newPage(), close: () => browser.close() }
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

const visit = async (page: PageHandle, origin: string, config: CaptureConfig, data: BonesData): Promise<void> => {
  const breakpoints = [...(config.breakpoints ?? DEFAULT_BREAKPOINTS)].sort((a, b) => a - b)
  for (const route of config.routes) {
    for (const breakpoint of breakpoints) {
      const url = new URL(route, origin).toString()
      merge(data, await capturePage(page, url, breakpoint, config.wait ?? DEFAULT_WAIT), breakpoint)
    }
  }
}

export const captureBones = async (origin: string, config: CaptureConfig): Promise<BonesData> => {
  const browser = await launchBrowser(config.cdp)
  const data: BonesData = {}
  try {
    const page = await browser.newPage()
    try {
      await visit(page, origin, config, data)
    } finally {
      await page.close()
    }
  } finally {
    await browser.close()
  }
  return data
}
