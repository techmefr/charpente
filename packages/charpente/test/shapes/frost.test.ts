import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { frostCard, frostChip } from '../../src/shape-exports'

const themes = { t: { paint: { block: { shape: 'frost-card' }, text: { shape: 'frost-chip' } } } }

describe('frost shapes', () => {
  it('stretch a glass body with a snow cap in the accent2 color', () => {
    for (const shape of [frostCard, frostChip]) {
      expect(shape.stretch).toBe(true)
      expect(shape.layers[0]?.role).toBe('body')
      expect(shape.layers.find((layer) => layer.name === 'Snow')?.role).toBe('accent2')
    }
  })

  it('draws an irregular cap that rises above the glass', () => {
    const cap = frostCard.layers.find((layer) => layer.name === 'Snow')?.path ?? ''
    const heights = [...cap.matchAll(/Q[\d.]+ ([\d.]+)/g)].map((match) => Number(match[1]))
    expect(new Set(heights).size).toBeGreaterThan(5)
    expect(Math.min(...heights)).toBeLessThan(12)
  })

  it('anchors a fern in two opposite corners at a fixed size', () => {
    const ferns = [frostCard.fixed].flat()
    expect(ferns.map((fern) => fern?.position)).toEqual(['left 2px top 15%', 'right 2px bottom 3%'])
    expect(ferns.every((fern) => fern?.size === 'auto 38%')).toBe(true)
    expect(frostChip.fixed).toBeUndefined()
  })

  it('compiles one mask and one overlay image per group with their positions', () => {
    const css = compile({ themes, defaultTheme: 't' }).css
    expect(css).toContain('mask-size: 100% 100%, auto 38%, auto 38%')
    expect(css).toContain('mask-position: center, left 2px top 15%, right 2px bottom 3%')
    expect(css).toContain('background-size: 60% 100%, auto 38%, auto 38%, 100% 100%')
    expect(css).toContain('background-position: var(--charpente-shine-x, -80%) 0, right 2px bottom 3%, left 2px top 15%, center')
  })
})
