import { watch } from 'node:fs'
import type { CaptureConfig, CharpenteConfig } from '../types'
import { captureBones } from './browser'
import { detectOrigin } from './detect'
import { createCapturer, isCaptureTrigger } from './session'
import { bonesPath, writeChangedBones } from './store'

export interface CaptureOptions {
  url?: string
  breakpoints?: string
  wait?: string
  out?: string
  cdp?: string
  watch?: boolean
}

const parseBreakpoints = (text: string): number[] => {
  const values = text.split(',').map((value) => Number(value.trim()))
  if (values.some((value) => !Number.isFinite(value) || value <= 0)) throw new Error(`charpente: invalid breakpoints "${text}"`)
  return values
}

export const withOptions = (capture: CaptureConfig, options: CaptureOptions): CaptureConfig => ({
  ...capture,
  ...(options.breakpoints ? { breakpoints: parseBreakpoints(options.breakpoints) } : {}),
  ...(options.wait !== undefined ? { wait: Number(options.wait) } : {}),
  ...(options.out ? { out: options.out } : {}),
  ...(options.cdp ? { cdp: options.cdp } : {}),
})

export const runCapture = async (root: string, config: CharpenteConfig, options: CaptureOptions, log: (message: string) => void): Promise<void> => {
  if (!config.capture) throw new Error('charpente: capture needs a "capture" entry in the configuration')
  const capture = withOptions(config.capture, options)
  const origin = options.url ?? capture.url ?? (await detectOrigin())
  if (!origin) throw new Error('charpente: no running application found, start it or pass --url')
  const resolved = { ...config, capture }
  const file = bonesPath(root, resolved)

  const once = async (): Promise<void> => {
    const changed = writeChangedBones(root, resolved, await captureBones(origin, capture))
    log(changed ? `wrote ${file}` : `unchanged ${file}`)
  }

  await once()
  if (!options.watch) return
  const capturer = createCapturer(once, log)
  watch(root, { recursive: true }, (_, name) => {
    if (name && isCaptureTrigger(name, file)) capturer.schedule()
  })
  await new Promise<void>(() => undefined)
}
