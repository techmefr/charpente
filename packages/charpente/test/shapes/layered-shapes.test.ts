import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { compile as compileLite } from '../../src/lite'
import { blob, gift, organicCard } from '../../src/shape-exports'
import type { ThemeDef } from '../../src/types'

const decoded = (css: string): string => css.replace(/(?:%[0-9A-F]{2})+/g, (code) => decodeURIComponent(code))

const dotted: ThemeDef = {
  tokens: { accent: '#ec4899', accent2: '#facc15' },
  dark: { accent: '#f9a8d4' },
  paint: { media: { fill: 'radial-gradient(#000 1px, transparent 2px)', size: '8px 8px', shape: 'gift' } },
}

describe('layered shapes', () => {
  it('masks the leaf with the silhouette and paints the body with the theme paint', () => {
    const { css } = compile({ themes: { dotted }, defaultTheme: 'dotted' })
    const rule = css.split('\n').join(' ')
    expect(rule).toContain('mask-image: url("data:image/svg+xml')
    expect(rule).toContain('-webkit-mask-size: contain')
    expect(rule).toContain('radial-gradient(#000 1px, transparent 2px)')
    expect(decoded(css)).toContain('fill="#ec4899"')
    expect(decoded(css)).toContain('fill="#facc15"')
  })

  it('swaps the accent colors in dark mode', () => {
    const { css } = compile({ themes: { dotted }, defaultTheme: 'dotted' })
    const dark = css.slice(css.indexOf('@media (prefers-color-scheme: dark) {', css.indexOf('mask-image')))
    expect(decoded(dark)).toContain('fill="#f9a8d4"')
  })

  it('honours the dark selector of the color scheme', () => {
    const { css } = compile({ themes: { dotted }, defaultTheme: 'dotted', colorScheme: { dark: '.dark' } })
    expect(decoded(css)).toMatch(/\.dark \[data-charpente-loading\][^{]*\{\s*background-image:[^}]*#f9a8d4/)
  })

  it('accepts an inline shape object and a custom shape from the config', () => {
    const custom = { viewBox: [10, 10] as [number, number], layers: [{ path: 'M0 0H10V10Z', role: 'body' as const }], stretch: true }
    const inline = compile({ themes: { t: { paint: { block: { shape: custom } } } } }).css
    expect(inline).toContain('mask-size: 100% 100%')
    const named = compile({ shapes: { wedge: custom }, themes: { t: { paint: { block: { shape: 'wedge' } } } } }).css
    expect(named).toContain('mask-image')
  })

  it('keeps shapes out of the lite entry and explains how to import one', () => {
    expect(() => compileLite({ themes: { t: { paint: { block: { shape: 'gift' } } } } })).toThrow(/charpente\/shapes/)
    const { css } = compileLite({ shapes: { gift }, themes: { t: { paint: { block: { shape: 'gift' } } } } })
    expect(css).toContain('mask-image')
  })

  it('rejects an unknown shape name', () => {
    expect(() => compile({ themes: { t: { paint: { block: { shape: 'nope' } } } } })).toThrow(/unknown shape "nope"/)
  })

  it('draws the same organic shape for the same seed only', () => {
    expect(blob(3)).toEqual(blob(3))
    expect(blob(3)).not.toEqual(blob(4))
    expect(organicCard(5).layers[0]?.path).toBe(organicCard(5).layers[0]?.path)
  })

  it('keeps the shape on captured media slots and on hover fills', () => {
    const themed: ThemeDef = { ...dotted, hover: { media: { fill: 'linear-gradient(red, red)' } } }
    const { css } = compile({ themes: { dotted: themed }, defaultTheme: 'dotted', bones: {} })
    expect(css).toMatch(/\[data-charpente-capture\]::after \{[^}]*mask-image/)
    expect(css).toMatch(/:hover(?:::after)? \{[^}]*background-image: var\(--charpente-shine-layer, none\), url\(/)
  })
})
