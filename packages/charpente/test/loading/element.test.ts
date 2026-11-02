// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import '../../src/loader'

let loader: HTMLElement

const attribute = (element: Element, name: string): string | null => element.getAttribute(name)

beforeEach(() => {
  vi.useFakeTimers()
  loader = document.createElement('charpente-loader')
  loader.textContent = 'content'
})

afterEach(() => {
  loader.remove()
  document.documentElement.style.removeProperty('--charpente-scope')
  vi.useRealTimers()
})

describe('charpente-loader', () => {
  it('stays untouched while it is not loading', () => {
    document.body.append(loader)
    expect(loader.hasAttribute('data-charpente-loading')).toBe(false)
    expect(loader.hasAttribute('aria-busy')).toBe(false)
  })

  it('sets the loading state on itself when the loading attribute is present', () => {
    loader.setAttribute('loading', '')
    document.body.append(loader)
    expect(attribute(loader, 'data-charpente-loading')).toBe('')
    expect(attribute(loader, 'aria-busy')).toBe('true')
    expect(loader.hasAttribute('inert')).toBe(true)
  })

  it('reflects theme, motion and timing as the matching attributes and variables', () => {
    loader.setAttribute('loading', '')
    loader.setAttribute('theme', 'night')
    loader.setAttribute('motion', 'shimmer pulse')
    loader.setAttribute('delay', '120')
    loader.setAttribute('stagger', '40')
    loader.setAttribute('reveal', '800')
    document.body.append(loader)
    expect(attribute(loader, 'data-charpente-theme')).toBe('night')
    expect(attribute(loader, 'data-charpente-motion')).toBe('pulse shimmer')
    expect(loader.style.getPropertyValue('--charpente-delay')).toBe('120ms')
    expect(loader.style.getPropertyValue('--charpente-stagger')).toBe('40ms')
    expect(loader.style.getPropertyValue('--charpente-reveal')).toBe('800ms')
  })

  it('follows changes of its attributes', () => {
    loader.setAttribute('loading', '')
    document.body.append(loader)
    loader.setAttribute('theme', 'night')
    expect(attribute(loader, 'data-charpente-theme')).toBe('night')
    loader.removeAttribute('theme')
    expect(loader.hasAttribute('data-charpente-theme')).toBe(false)
  })

  it('exposes loading as a property', () => {
    document.body.append(loader)
    ;(loader as HTMLElement & { loading: boolean }).loading = true
    expect(loader.hasAttribute('loading')).toBe(true)
    expect(attribute(loader, 'data-charpente-loading')).toBe('')
  })
})

describe('charpente-loader reveal and scope', () => {
  it('marks itself ready for the fade-in after loading ends', () => {
    loader.setAttribute('loading', '')
    document.body.append(loader)
    loader.removeAttribute('loading')
    expect(loader.hasAttribute('data-charpente-loading')).toBe(false)
    expect(loader.hasAttribute('data-charpente-ready')).toBe(true)
    vi.advanceTimersByTime(259)
    expect(loader.hasAttribute('data-charpente-ready')).toBe(true)
    vi.advanceTimersByTime(2)
    expect(loader.hasAttribute('data-charpente-ready')).toBe(false)
  })

  it('keeps the ready window open for every nested reveal step', () => {
    loader.setAttribute('loading', '')
    loader.setAttribute('reveal', '1000')
    loader.setAttribute('reveal-ms', '300')
    document.body.append(loader)
    loader.removeAttribute('loading')
    vi.advanceTimersByTime(300 + 1000 * 5 - 1)
    expect(loader.hasAttribute('data-charpente-ready')).toBe(true)
    vi.advanceTimersByTime(2)
    expect(loader.hasAttribute('data-charpente-ready')).toBe(false)
  })

  it('applies the loading state to the page when the scope is page', () => {
    loader.setAttribute('loading', '')
    loader.setAttribute('scope', 'page')
    document.body.append(loader)
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(true)
    expect(loader.hasAttribute('data-charpente-loading')).toBe(false)
    loader.remove()
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(false)
  })

  it('moves the loading state back to itself when the scope returns to element', () => {
    loader.setAttribute('loading', '')
    loader.setAttribute('scope', 'page')
    document.body.append(loader)
    loader.setAttribute('scope', 'element')
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(false)
    expect(loader.hasAttribute('data-charpente-loading')).toBe(true)
  })

  it('follows the scope configured in the generated stylesheet', () => {
    document.documentElement.style.setProperty('--charpente-scope', 'page')
    loader.setAttribute('loading', '')
    document.body.append(loader)
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(true)
    expect(loader.hasAttribute('data-charpente-loading')).toBe(false)
  })

  it('cleans up when it leaves the document', () => {
    loader.setAttribute('loading', '')
    document.body.append(loader)
    loader.remove()
    expect(loader.hasAttribute('data-charpente-loading')).toBe(false)
    expect(loader.hasAttribute('aria-busy')).toBe(false)
  })
})
