import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { compile as compileLite } from '../../src/lite'
import { giftSnow, giftSnowButton, giftSnowFill, giftSnowLine } from '../../src/shape-exports'

const decoded = (css: string): string => css.replace(/(?:%[0-9A-F]{2})+/g, (code) => decodeURIComponent(code))

describe('gift-snow shape', () => {
  it('has a body, gold-ribbon accents, a snow cap and a big bow', () => {
    const roles = giftSnow.layers.map((layer) => layer.role)
    expect(roles.filter((role) => role === 'body')).toHaveLength(2)
    expect(giftSnow.layers.find((layer) => layer.name === 'Snow cap')?.role).toBe('accent2')
    expect(roles).toContain('accent')
  })

  it('takes its colors from the theme tokens', () => {
    const themes = { t: { tokens: { accent: '#f5b82e', accent2: '#f8fafc' }, paint: { block: { shape: 'gift-snow' } } } }
    const css = decoded(compile({ themes, defaultTheme: 't' }).css)
    expect(css).toContain('fill="#f5b82e"')
    expect(css).toContain('fill="#f8fafc"')
  })

  it('is registered by name in the lite entry', () => {
    const css = compileLite({ shapes: { 'gift-snow': giftSnow }, themes: { t: { paint: { block: { shape: 'gift-snow' } } } } }).css
    expect(css).toContain('mask-image')
  })
})

describe('stretched gift-snow shapes', () => {
  const stretched = { giftSnowFill, giftSnowButton, giftSnowLine }

  it('stretch over the whole leaf and keep every layer inside the view box', () => {
    for (const [name, shape] of Object.entries(stretched)) {
      expect(shape.stretch, name).toBe(true)
      expect(shape.layers.some((layer) => layer.name === 'Snow cap' && layer.role === 'accent2'), name).toBe(true)
      const numbers = shape.layers.flatMap((layer) => (layer.path.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number))
      expect(Math.min(...numbers), name).toBeGreaterThanOrEqual(-shape.viewBox[0] * 0.2)
    }
  })

  it('are registered by name', () => {
    const css = compile({ themes: { t: { paint: { text: { shape: 'gift-snow-line' }, control: { shape: 'gift-snow-button' }, block: { shape: 'gift-snow-fill' } } } } }).css
    expect(css.match(/mask-size: 100% 100%/g)?.length).toBeGreaterThanOrEqual(3)
  })
})
