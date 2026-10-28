import { describe, expect, it } from 'vitest'
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

  it('removes everything it applied when loading ends', () => {
    const element = fakeElement()
    apply(element, { loading: true, theme: 'ocean', motion: 'pulse', delay: 120, stagger: 40 })
    apply(element, { loading: false })
    expect(element.attributes.size).toBe(0)
    expect(element.properties.size).toBe(0)
  })
})
