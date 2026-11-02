import { describe, expect, it } from 'vitest'
import { compile } from '../../src'

describe('compile motions', () => {
  it('generates one rule per motion combination', () => {
    const { css } = compile()
    expect(css).toContain('[data-charpente-motion="glitch shimmer"]')
    expect(css).toContain('[data-charpente-motion="none"]')
  })

  it('applies the default motion when no attribute is set', () => {
    const { css } = compile({ motion: ['glitch', 'shimmer'] })
    expect(css).toMatch(
      /:not\(\[data-charpente-motion\]\)[^{]*\{\s*animation: charpente-reveal[^;]*charpente-glitch[^;]*charpente-shimmer/,
    )
  })

  it('uses the configured timing as defaults', () => {
    const { css } = compile({ timing: { delay: 300, stagger: 40 } })
    expect(css).toContain('var(--charpente-delay, 300ms)')
    expect(css).toContain('var(--charpente-stagger, 40ms)')
  })

  it('starts every motion after the delay plus the stagger', () => {
    const { css } = compile({ motion: ['glitch', 'pulse', 'shimmer'], timing: { stagger: 40 } })
    for (const name of ['glitch', 'pulse', 'shimmer']) {
      const animation = css.match(new RegExp(`charpente-${name} [^;]*?infinite`))?.[0] ?? ''
      expect(animation).toContain('var(--charpente-i, 0) * var(--charpente-stagger, 40ms)')
    }
  })

  it('exposes the configured scope to the runtime as a custom property', () => {
    expect(compile().css).toContain('--charpente-scope: element;')
    expect(compile({ scope: 'page' }).css).toContain('--charpente-scope: page;')
  })

  it('registers custom motions and keyframes', () => {
    const { css } = compile({
      motions: { blink: { duration: '1s', keyframes: { '50%': { opacity: '0' } } } },
    })
    expect(css).toContain('@keyframes charpente-blink')
    expect(css).toContain('[data-charpente-motion="blink"]')
  })

  it('throws on an unknown motion', () => {
    expect(() => compile({ motion: 'nope' })).toThrow('unknown motion "nope"')
  })

  it('warns when two default motions animate the same property', () => {
    const { warnings } = compile({
      motion: ['pulse', 'breathe'],
      motions: { breathe: { duration: '1s', keyframes: { '50%': { opacity: '0.3' } } } },
    })
    expect(warnings.join('\n')).toContain('"opacity"')
  })

  it('does not warn for compatible motions', () => {
    expect(compile({ motion: ['shimmer', 'glitch'] }).warnings).toEqual([])
  })

  it('turns every animation off under reduced motion', () => {
    const { css } = compile()
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain('animation: none !important')
  })

  it('matches motion names whatever their order in the attribute', () => {
    expect(compile().css).toContain(
      '[data-charpente-loading][data-charpente-motion~="glitch"][data-charpente-motion~="shimmer"]:not([data-charpente-motion~="pulse"])',
    )
  })
})
