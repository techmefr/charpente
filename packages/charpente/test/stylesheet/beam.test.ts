import { describe, expect, it } from 'vitest'
import { compile } from '../../src'

const bones = { card: { '1280': { width: 100, height: 40, bones: [{ x: 0, y: 0, width: 100, height: 40, radius: 4, kind: 'block' as const }] } } }

describe('border beam', () => {
  it('draws a rotating ring on the shapes from the accent tokens', () => {
    const { css } = compile({ motion: 'border-beam' })
    expect(css).toContain('@keyframes charpente-border-beam')
    expect(css).toContain('conic-gradient(from var(--charpente-beam-angle)')
    expect(css).toContain('var(--charpente-accent, #38bdf8)')
    expect(css).toContain('var(--charpente-beam-width, 2px)')
    expect(css).toContain('mask-composite: exclude')
  })

  it('follows the silhouette of a shape through a mask variable', () => {
    const css = compile({ motion: 'border-beam', themes: { cut: { extends: 'solid', paint: { block: { shape: 'gift' } } } } }).css
    expect(css).toContain('--charpente-shape-mask: url(')
    expect(css).toContain('var(--charpente-shape-mask,')
  })

  it('keeps a fixed position when animations are off', () => {
    expect(compile({ motion: 'border-beam' }).css).toContain("@property --charpente-beam-angle { syntax: '<angle>'; inherits: true; initial-value: 40deg; }")
  })

  it('traces the captured zones through a ring mask only when used', () => {
    expect(compile({ motion: 'border-beam', bones }).css).toContain('--charpente-ring-mask: url(')
    expect(compile({ motion: 'shimmer', bones }).css).not.toContain('--charpente-ring-mask: url(')
  })

  it('runs on its own through the attribute', () => {
    expect(compile().css).toContain('[data-charpente-motion="border-beam"]')
  })
})

describe('border beam line and beam shimmer', () => {
  it('moves a stripe along the bottom edge', () => {
    const { css } = compile({ motion: 'border-beam-line' })
    expect(css).toContain('background-position: var(--charpente-beam-x) 0')
    expect(css).toContain('var(--charpente-beam-size, 40%)')
  })

  it('sweeps a diagonal band with a sharp core', () => {
    const { css } = compile({ motion: 'beam' })
    expect(css).toContain('--charpente-shine-layer: linear-gradient(115deg')
  })

  it('scales the new durations with the speed variable', () => {
    const { css } = compile()
    for (const [name, duration] of [['beam', '2.2s'], ['border-beam', '3.2s'], ['border-beam-line', '2.8s']]) {
      expect(css).toContain(`charpente-${name} calc(${duration} * var(--charpente-speed, 1))`)
    }
  })
})
