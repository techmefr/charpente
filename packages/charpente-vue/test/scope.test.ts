// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp, h, nextTick, type App } from 'vue'
import { Charpente } from '../src'

let host: HTMLElement
let app: App | undefined

const mount = async (props: Record<string, unknown>) => {
  app = createApp({ render: () => h(Charpente, props, () => 'x') })
  app.mount(host)
  await nextTick()
  return host.firstElementChild as HTMLElement
}

beforeEach(() => {
  host = document.createElement('div')
  document.body.appendChild(host)
})

afterEach(() => {
  app?.unmount()
  app = undefined
  host.remove()
})

describe('Charpente scope', () => {
  it('applies the loading state to the page when the scope is page', async () => {
    const element = await mount({ loading: true, scope: 'page' })
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(true)
    expect(document.documentElement.getAttribute('aria-busy')).toBe('true')
    expect(element.hasAttribute('data-charpente-loading')).toBe(false)
    app?.unmount()
    app = undefined
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(false)
  })

  it('keeps the loading state on the element by default', async () => {
    const element = await mount({ loading: true })
    expect(element.hasAttribute('data-charpente-loading')).toBe(true)
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(false)
  })

  it('follows the scope configured in the generated stylesheet', async () => {
    document.documentElement.style.setProperty('--charpente-scope', 'page')
    const element = await mount({ loading: true })
    await nextTick()
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(true)
    expect(element.hasAttribute('data-charpente-loading')).toBe(false)
    document.documentElement.style.removeProperty('--charpente-scope')
  })
})
