import { describe, expect, it } from 'vitest'
import { disposeMount, mount, useMountLifecycle } from './mount-charpente'

useMountLifecycle()

describe('Charpente page scope', () => {
  it('applies the loading state to the page when the scope is page', () => {
    const root = mount({ loading: true, scope: 'page', children: 'x' })
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(true)
    expect(document.documentElement.getAttribute('aria-busy')).toBe('true')
    expect(root.hasAttribute('data-charpente-loading')).toBe(false)
    disposeMount()
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(false)
  })

  it('keeps the loading state on the element by default', () => {
    const root = mount({ loading: true, children: 'x' })
    expect(root.hasAttribute('data-charpente-loading')).toBe(true)
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(false)
  })
})
