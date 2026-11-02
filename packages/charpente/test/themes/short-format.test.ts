import { describe, expect, it } from 'vitest'
import { compile, defineTheme, expandTheme } from '../../src'

const PAINT_TYPES = ['text', 'media', 'control', 'block'] as const

describe('short theme format', () => {
  it('expands colors, pattern and border into tokens and paint for every type', () => {
    const theme = expandTheme(defineTheme({ colors: ['#111111', '#222222'], pattern: 'dots', border: '1px solid red' }))
    expect(theme.tokens).toMatchObject({ base: '#111111', strong: '#222222' })
    for (const type of PAINT_TYPES) {
      expect(theme.paint?.[type]?.fill).toContain('radial-gradient')
      expect(theme.paint?.[type]?.style).toMatchObject({ border: '1px solid red' })
    }
  })

  it('lets an explicit paint override the expanded one', () => {
    const theme = expandTheme({ pattern: 'dots', paint: { text: { fill: 'red' } } })
    expect(theme.paint?.text?.fill).toBe('red')
    expect(theme.paint?.media?.fill).toContain('radial-gradient')
  })

  it('applies the radius to every type and defaults to the radius token', () => {
    const rounded = expandTheme({ pattern: 'dots', radius: '4px' })
    const standard = expandTheme({ pattern: 'dots' })
    for (const type of PAINT_TYPES) {
      expect(rounded.paint?.[type]?.style).toMatchObject({ borderRadius: '4px' })
      expect(standard.paint?.[type]?.style).toMatchObject({ borderRadius: 'var(--charpente-radius)' })
    }
  })

  it('rejects an unknown pattern', () => {
    expect(() => expandTheme({ pattern: 'nope' })).toThrow('unknown pattern "nope"')
  })

  it('compiles a short theme declared in the config', () => {
    const { css } = compile({ themes: { aurore: { colors: ['#fde8e8', '#f5c2c2'], pattern: 'stripes' } } })
    expect(css).toContain('[data-charpente-theme="aurore"]')
  })
})
