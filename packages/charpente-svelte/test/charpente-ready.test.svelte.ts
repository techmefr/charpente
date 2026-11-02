import { flushSync } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { mountWithProps, useMountLifecycle, withContent } from './mount-charpente'

useMountLifecycle()

describe('Charpente ready', () => {
  it('sets the ready attribute for revealMs after loading ends', () => {
    vi.useFakeTimers()
    const props = $state(withContent({ loading: true, revealMs: 300 }))
    const root = mountWithProps(props)
    expect(root.hasAttribute('data-charpente-ready')).toBe(false)
    props.loading = false
    flushSync()
    expect(root.hasAttribute('data-charpente-ready')).toBe(true)
    vi.advanceTimersByTime(299)
    flushSync()
    expect(root.hasAttribute('data-charpente-ready')).toBe(true)
    vi.advanceTimersByTime(2)
    flushSync()
    expect(root.hasAttribute('data-charpente-ready')).toBe(false)
  })
})
