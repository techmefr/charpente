import { resolve } from 'node:path'

const DEFAULT_DELAY = 800
const IGNORED = /(^|[\\/])(node_modules|\.git|dist|\.astro|\.next|\.nuxt|\.svelte-kit)([\\/]|$)/

export interface Capturer {
  schedule: () => void
  run: () => Promise<void>
}

export const createCapturer = (task: () => Promise<void>, report: (message: string) => void, delay = DEFAULT_DELAY): Capturer => {
  let timer: ReturnType<typeof setTimeout> | undefined
  let running = false
  let again = false

  const run = async (): Promise<void> => {
    if (running) {
      again = true
      return
    }
    running = true
    try {
      await task()
    } catch (error) {
      report((error as Error).message)
    } finally {
      running = false
    }
    if (again) {
      again = false
      await run()
    }
  }

  const schedule = (): void => {
    clearTimeout(timer)
    timer = setTimeout(() => void run(), delay)
  }

  return { run, schedule }
}

export const isCaptureTrigger = (file: string, bones: string): boolean => resolve(file) !== bones && !IGNORED.test(file)
