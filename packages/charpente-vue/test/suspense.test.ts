// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, type App } from 'vue'
import { CharpenteSuspense } from '../src'

let host: HTMLElement
let app: App | undefined

beforeEach(() => {
  host = document.createElement('div')
  document.body.appendChild(host)
})

afterEach(() => {
  app?.unmount()
  host.remove()
})

describe('CharpenteSuspense', () => {
  it('shows the loading skeleton while the content is pending and the zone once it resolved', async () => {
    let release = (): void => undefined
    const Late = defineComponent({
      async setup() {
        await new Promise<void>((done) => (release = done))
        return () => h('p', 'ready')
      },
    })
    app = createApp({
      render: () =>
        h(CharpenteSuspense, { capture: 'team', theme: 'solid' }, { default: () => h(Late), fallback: () => 'placeholder' }),
    })
    app.mount(host)
    await nextTick()
    const pending = host.firstElementChild as HTMLElement
    expect(pending.hasAttribute('data-charpente-loading')).toBe(true)
    expect(pending.getAttribute('data-charpente-capture')).toBe('team')
    expect(pending.textContent).toBe('placeholder')

    release()
    await vi.waitFor(() => expect(host.textContent).toBe('ready'))
    const loaded = host.firstElementChild as HTMLElement
    expect(loaded.getAttribute('data-charpente-capture')).toBe('team')
    expect(loaded.hasAttribute('data-charpente-loading')).toBe(false)
    expect(loaded.textContent).toBe('ready')
  })

  it('keeps one zone mounted and plays the reveal when the content resolves', async () => {
    let release = (): void => undefined
    const Late = defineComponent({
      async setup() {
        await new Promise<void>((done) => (release = done))
        return () => h('p', 'ready')
      },
    })
    app = createApp({
      render: () => h(CharpenteSuspense, { capture: 'team' }, { default: () => h(Late), fallback: () => 'placeholder' }),
    })
    app.mount(host)
    await nextTick()
    const zone = host.firstElementChild as HTMLElement
    expect(zone.hasAttribute('data-charpente-ready')).toBe(false)

    release()
    await vi.waitFor(() => expect(zone.hasAttribute('data-charpente-ready')).toBe(true))
    expect(host.firstElementChild).toBe(zone)
    expect(zone.textContent).toBe('ready')
  })

  it('announces the label on the fallback', async () => {
    const Never = defineComponent({
      async setup() {
        await new Promise<void>(() => undefined)
        return () => h('p', 'ready')
      },
    })
    app = createApp({
      render: () => h(CharpenteSuspense, { label: 'Loading team' }, { default: () => h(Never), fallback: () => 'placeholder' }),
    })
    app.mount(host)
    await nextTick()
    expect(host.querySelector('span[role=status]')?.textContent).toBe('Loading team')
  })
})
