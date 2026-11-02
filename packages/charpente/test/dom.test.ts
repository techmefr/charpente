import { describe, expect, it } from 'vitest'
import { MAX_REVEAL_DEPTH, revealWindow } from '../src'
import { setLoading } from '../src/dom'

const fakeElement = () => {
  const attributes = new Map<string, string>()
  const properties = new Map<string, string>()
  const element = {
    attributes,
    properties,
    setAttribute: (name: string, value: string) => void attributes.set(name, value),
    removeAttribute: (name: string) => void attributes.delete(name),
    style: {
      setProperty: (name: string, value: string) => void properties.set(name, value),
      removeProperty: (name: string) => void properties.delete(name),
    },
  }
  return element
}

const apply = (element: ReturnType<typeof fakeElement>, options: Parameters<typeof setLoading>[1]) =>
  setLoading(element as unknown as HTMLElement, options)

describe('setLoading', () => {
  it('applies the loading attributes and timing variables', () => {
    const element = fakeElement()
    apply(element, { loading: true, theme: 'ocean', motion: ['shimmer', 'glitch'], delay: 120, stagger: 40 })
    expect(Object.fromEntries(element.attributes)).toEqual({
      'data-charpente-loading': '',
      'aria-busy': 'true',
      inert: '',
      'data-charpente-theme': 'ocean',
      'data-charpente-motion': 'glitch shimmer',
    })
    expect(Object.fromEntries(element.properties)).toEqual({
      '--charpente-delay': '120ms',
      '--charpente-stagger': '40ms',
    })
  })

  it('keeps the ready window open for the fade-in plus every nested step', () => {
    expect(revealWindow(260)).toBe(260)
    expect(revealWindow(260, 1000)).toBe(260 + 1000 * (MAX_REVEAL_DEPTH - 1))
  })

  it('marks the area as ready when asked and clears it with the rest', () => {
    const element = fakeElement()
    apply(element, { loading: false, ready: true })
    expect(element.attributes.get('data-charpente-ready')).toBe('')
    apply(element, { loading: false })
    expect(element.attributes.size).toBe(0)
  })

  it('applies the reveal step as an attribute and a variable', () => {
    const element = fakeElement()
    apply(element, { loading: true, reveal: 1000 })
    expect(element.attributes.get('data-charpente-reveal')).toBe('')
    expect(element.properties.get('--charpente-reveal')).toBe('1000ms')
  })

  it('applies the loading state to the page when the scope is page', () => {
    const page = fakeElement()
    const element = Object.assign(fakeElement(), { ownerDocument: { documentElement: page } })
    apply(element, { loading: true, scope: 'page' })
    expect(page.attributes.get('data-charpente-loading')).toBe('')
    expect(element.attributes.size).toBe(0)
    apply(element, { loading: false, scope: 'page' })
    expect(page.attributes.size).toBe(0)
  })

  it('moves the loading state back to the element when the scope returns to element', () => {
    const page = fakeElement()
    const element = Object.assign(fakeElement(), { ownerDocument: { documentElement: page } })
    apply(element, { loading: true, scope: 'page' })
    apply(element, { loading: true })
    expect(element.attributes.get('data-charpente-loading')).toBe('')
  })

  it('removes everything it applied when loading ends', () => {
    const element = fakeElement()
    apply(element, { loading: true, theme: 'ocean', motion: 'pulse', delay: 120, stagger: 40 })
    apply(element, { loading: false })
    expect(element.attributes.size).toBe(0)
    expect(element.properties.size).toBe(0)
  })
})
