import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { builtinMotions } from '../../src/motions'

const bones = { card: { '1280': { width: 100, height: 40, bones: [{ x: 0, y: 0, width: 100, height: 40, radius: 4, kind: 'block' as const }] } } }

describe('glitch split', () => {
  it('animates the loading container with a split filter', () => {
    const { css } = compile({ motion: 'glitch' })
    expect(css).toContain('@keyframes charpente-glitch-container')
    expect(css).toMatch(/\[data-charpente-loading\]:not\(\[data-charpente-motion\]\) \{\s*animation: charpente-glitch-container/)
    expect(css).toMatch(/\[data-charpente-loading\]\[data-charpente-motion="glitch"\][^{]*\{\s*animation: charpente-glitch-container/)
  })

  it('does not put the split filter on the leaves', () => {
    const leaf = compile({ motion: 'glitch' }).css.split('}').find((rule) => rule.includes('charpente-reveal') && rule.includes('charpente-glitch '))
    expect(leaf).toBeDefined()
    expect(leaf).not.toContain('charpente-glitch-container')
  })

  it('takes the ghost colors from the accent tokens with a fallback', () => {
    const css = compile().css
    expect(css).toMatch(/filter: drop-shadow\([^)]*var\(--charpente-accent2, #22d3ee\)\) drop-shadow\([^)]*var\(--charpente-accent, #ec4899\)\)/)
  })

  it('is back to a clean filter outside the burst', () => {
    expect(builtinMotions.glitch?.container?.['0%, 86%, 94%, 100%']).toEqual({ filter: 'none' })
  })

  it('works in capture mode with the same container rule', () => {
    const css = compile({ motion: 'glitch', bones }).css
    expect(css).toMatch(/\[data-charpente-motion="glitch"\][^{]*\{\s*animation: charpente-glitch-container/)
    expect(css).toContain('[data-charpente-capture]::before')
  })

  it('adds no container rule for a motion without container keyframes', () => {
    expect(compile({ motion: 'shimmer' }).css).not.toMatch(/\{\s*animation: charpente-shimmer-container/)
  })

  it('turns the container animation off under reduced motion', () => {
    const css = compile().css
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\[data-charpente-loading\] \{\s*animation: none !important/)
  })

  it('combines with other motions on the container', () => {
    const css = compile().css
    expect(css).toMatch(/\[data-charpente-motion="glitch shimmer"\][^{]*\{\s*animation: charpente-glitch-container/)
  })
})

describe('motion speeds', () => {
  it('keeps calm, coherent built-in durations', () => {
    const durations = Object.fromEntries(Object.entries(builtinMotions).map(([name, motion]) => [name, motion.duration]))
    expect(durations).toEqual({ shimmer: '1.8s', sweep: '2.4s', pulse: '1.6s', glitch: '3.4s', waves: '10s', matrix: '6s', snow: '18s', petals: '16s', leaves: '17s', sparkle: '12s' })
  })

  it('scales every duration with --charpente-speed', () => {
    const { css } = compile({ motion: ['glitch', 'pulse', 'shimmer'] })
    for (const name of ['glitch', 'pulse', 'shimmer']) {
      expect(css).toMatch(new RegExp(`charpente-${name} calc\\([^)]*\\* var\\(--charpente-speed, 1\\)\\)`))
    }
    expect(css).toContain('charpente-glitch-container calc(3.4s * var(--charpente-speed, 1))')
  })
})
