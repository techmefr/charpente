// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
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
    await new Promise((done) => setTimeout(done, 20))
    const loaded = host.firstElementChild as HTMLElement
    expect(loaded.hasAttribute('data-charpente-loading')).toBe(false)
    expect(loaded.textContent).toBe('ready')
  })
})
