import { describe, expect, it } from 'vitest'
import type { CharpenteProps } from '../src'
import { disposeMount, getHost, isInert, mount, useMountLifecycle } from './mount-charpente'

useMountLifecycle()

describe('Charpente', () => {
  it('renders a plain div when not loading', () => {
    mount({ children: 'hello' })
    expect(getHost().innerHTML).toBe('<div>hello</div>')
  })

  it('adds the loading attributes', () => {
    const root = mount({ loading: true, theme: 'solid', children: 'x' })
    expect(root.hasAttribute('data-charpente-loading')).toBe(true)
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(isInert(root)).toBe(true)
    expect(root.getAttribute('data-charpente-theme')).toBe('solid')
  })

  it('uses the tag and forwards props', () => {
    const root = mount({ tag: 'ul', class: 'grid', 'data-testid': 'root', loading: true, children: 'x' } as CharpenteProps)
    expect(root.tagName).toBe('UL')
    expect(root.className).toBe('grid')
    expect(root.getAttribute('data-testid')).toBe('root')
  })

  it('sets the delay and stagger variables and merges style', () => {
    const root = mount({ loading: true, delay: 100, stagger: 40, style: { color: 'red' }, children: 'x' })
    expect(root.style.getPropertyValue('--charpente-delay')).toBe('100ms')
    expect(root.style.getPropertyValue('--charpente-stagger')).toBe('40ms')
    expect(root.style.color).toBe('red')
  })

  it('sorts several motions', () => {
    const root = mount({ loading: true, motion: ['shimmer', 'glitch'], children: 'x' })
    expect(root.getAttribute('data-charpente-motion')).toBe('glitch shimmer')
  })

  it('renders a status label only while loading', () => {
    mount({ loading: true, label: 'Loading', children: 'x' })
    expect(getHost().querySelector('[role=status]')?.textContent).toBe('Loading')
    disposeMount()
    getHost().innerHTML = ''
    mount({ label: 'Loading', children: 'x' })
    expect(getHost().querySelector('[role=status]')).toBeNull()
  })
})
