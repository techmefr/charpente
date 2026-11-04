import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { compile as compileLite } from '../../src/lite'
import { giftWrap, giftWrapBand } from '../../src/shape-exports'

const decoded = (css: string): string => css.replace(/(?:%[0-9A-F]{2})+/g, (code) => decodeURIComponent(code))

const themes = {
  t: { tokens: { accent: '#b3202b' }, paint: { block: { shape: 'gift-wrap' }, text: { shape: 'gift-wrap-band' } } },
}

describe('gift wrap shapes', () => {
  it('stretch the paper and ribbons and keep the bow at a fixed ratio', () => {
    for (const shape of [giftWrap, giftWrapBand]) {
      expect(shape.stretch).toBe(true)
      expect(shape.layers[0]?.role).toBe('body')
      const [fixed] = [shape.fixed].flat()
      expect(fixed?.size).toMatch(/^auto \d+%$/)
      expect(fixed?.layers.some((layer) => layer.name === 'Knot')).toBe(true)
    }
  })

  it('crosses the whole paper with a ribbon and leaves a band with one ribbon', () => {
    const cross = giftWrap.layers.filter((layer) => layer.role === 'accent').map((layer) => layer.name)
    expect(cross).toEqual(['Vertical ribbon', 'Horizontal ribbon'])
    expect(giftWrapBand.layers.filter((layer) => layer.role === 'accent')).toHaveLength(1)
  })

  it('masks with the paper and the bow and paints both over the theme paint', () => {
    const css = compile({ themes, defaultTheme: 't' }).css
    expect(css).toContain('mask-size: 100% 100%, auto 64%')
    expect(css).toContain('mask-size: 100% 100%, auto 118%')
    expect(css).toContain('background-size: 60% 100%, auto 64%, 100% 100%')
  })

  it('shades the ribbon and the bow with gradients of the accent color', () => {
    const css = decoded(compile({ themes, defaultTheme: 't' }).css)
    expect(css).toContain('<linearGradient')
    expect(css).toContain('stop-color="#b3202b"')
    expect(css).toMatch(/fill="url\(#g\d+\)"/)
  })

  it('keeps a flat fill when the accent is not a plain hex color', () => {
    const css = decoded(compile({ themes: { t: { tokens: { accent: 'rgb(10, 20, 30)' }, paint: { block: { shape: 'gift-wrap' } } } }, defaultTheme: 't' }).css)
    expect(css).not.toContain('<linearGradient')
  })

  it('is registered by name in the lite entry', () => {
    const css = compileLite({ shapes: { 'gift-wrap': giftWrap }, themes: { t: { paint: { block: { shape: 'gift-wrap' } } } } }).css
    expect(css).toContain('mask-image')
  })
})
