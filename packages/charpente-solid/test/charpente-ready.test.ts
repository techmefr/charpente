import { createSignal } from 'solid-js'
import { describe, expect, it, vi } from 'vitest'
import { mount, useMountLifecycle } from './mount-charpente'

useMountLifecycle()

describe('Charpente ready', () => {
  it('sets the ready attribute for revealMs after loading ends', () => {
    vi.useFakeTimers()
    const [loading, setLoading] = createSignal(true)
    const root = mount({
      get loading() {
        return loading()
      },
      revealMs: 300,
      children: 'x',
    })
    expect(root.hasAttribute('data-charpente-ready')).toBe(false)
    setLoading(false)
    expect(root.hasAttribute('data-charpente-ready')).toBe(true)
    vi.advanceTimersByTime(299)
    expect(root.hasAttribute('data-charpente-ready')).toBe(true)
    vi.advanceTimersByTime(2)
    expect(root.hasAttribute('data-charpente-ready')).toBe(false)
  })

  it('does not set the ready attribute when it never loaded', () => {
    const root = mount({ loading: false, children: 'x' })
    expect(root.hasAttribute('data-charpente-ready')).toBe(false)
  })
})
