import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { snowCapCard, snowCapChip } from '../../src/shape-exports'

describe('snow cap shapes', () => {
  it('stretch a plain body topped by snow in the accent2 color', () => {
    for (const shape of [snowCapCard, snowCapChip]) {
      expect(shape.stretch).toBe(true)
      expect(shape.layers[0]?.role).toBe('body')
      expect(shape.layers.some((layer) => layer.role === 'accent2')).toBe(true)
      expect(shape.fixed).toBeUndefined()
    }
  })

  it('lets the snow overhang the body on both sides and hang icicles', () => {
    const body = snowCapCard.layers.find((layer) => layer.name === 'Body')?.path ?? ''
    expect(body.startsWith('M16 30')).toBe(true)
    expect(snowCapCard.layers.find((layer) => layer.name === 'Snow')?.path.startsWith('M0 30')).toBe(true)
    expect(snowCapCard.layers.find((layer) => layer.name === 'Icicles')?.role).toBe('shine')
  })

  it('compiles for the leaf types of the winter snow variant', () => {
    const paint = { block: { shape: 'snow-cap' }, media: { shape: 'snow-cap' }, text: { shape: 'snow-cap-chip' }, control: { shape: 'snow-cap-chip' } }
    const css = compile({ themes: { t: { tokens: { accent2: '#f6f9fc' }, paint } }, defaultTheme: 't' }).css
    expect(css.match(/mask-size: 100% 100%/g)?.length).toBeGreaterThanOrEqual(4)
  })
})
