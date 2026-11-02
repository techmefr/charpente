import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createCapturer, isCaptureTrigger, withOptions, writeChangedBones } from '../../src/capturing'
import type { BonesData } from '../../src'

afterEach(() => {
  vi.useRealTimers()
})

describe('capture options', () => {
  const base = { routes: ['/'], breakpoints: [375], wait: 100 }

  it('lets the command line override the configuration', () => {
    const capture = withOptions(base, { breakpoints: '320, 1024', wait: '0', out: 'zones.json', cdp: 'http://localhost:9222' })
    expect(capture).toMatchObject({ breakpoints: [320, 1024], wait: 0, out: 'zones.json', cdp: 'http://localhost:9222' })
  })

  it('keeps the configuration when no option is given', () => {
    expect(withOptions(base, {})).toEqual(base)
  })

  it('rejects breakpoints that are not positive numbers', () => {
    expect(() => withOptions(base, { breakpoints: '320,abc' })).toThrow('invalid breakpoints')
  })
})

describe('incremental write', () => {
  const data: BonesData = { hero: { '375': { width: 375, height: 100, bones: [] } } }

  it('reports a change only when the measures differ', () => {
    const root = mkdtempSync(join(tmpdir(), 'charpente-bones-'))
    const config = { capture: { routes: ['/'] } }
    expect(writeChangedBones(root, config, data)).toBe(true)
    expect(writeChangedBones(root, config, data)).toBe(false)
    expect(writeChangedBones(root, config, { hero: { '375': { width: 375, height: 120, bones: [] } } })).toBe(true)
  })
})

describe('capture triggers', () => {
  const bones = resolve('charpente.bones.json')

  it('ignores the bones file and generated folders', () => {
    expect(isCaptureTrigger('charpente.bones.json', bones)).toBe(false)
    expect(isCaptureTrigger('node_modules/vite/index.js', bones)).toBe(false)
    expect(isCaptureTrigger('src/App.vue', bones)).toBe(true)
  })
})

describe('capturer', () => {
  it('groups a burst of changes into one capture', async () => {
    vi.useFakeTimers()
    const task = vi.fn(async () => undefined)
    const capturer = createCapturer(task, () => undefined, 100)
    capturer.schedule()
    capturer.schedule()
    capturer.schedule()
    await vi.advanceTimersByTimeAsync(150)
    expect(task).toHaveBeenCalledTimes(1)
  })

  it('runs once more when a change arrives during a capture', async () => {
    let release = (): void => undefined
    const task = vi.fn(() => new Promise<void>((done) => (release = done)))
    const capturer = createCapturer(task, () => undefined)
    const first = capturer.run()
    void capturer.run()
    release()
    await vi.waitFor(() => expect(task).toHaveBeenCalledTimes(2))
    release()
    await first
    expect(task).toHaveBeenCalledTimes(2)
  })

  it('reports a failing capture instead of throwing', async () => {
    const report = vi.fn()
    await createCapturer(async () => Promise.reject(new Error('no browser')), report).run()
    expect(report).toHaveBeenCalledWith('no browser')
  })
})
