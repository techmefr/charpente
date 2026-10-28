import { describe, expect, it } from 'vitest'
import { compile, defineCharpente } from '../src'

describe('compile', () => {
  it('wraps the rules in a cascade layer', () => {
    expect(compile().css).toContain('@layer charpente {')
  })

  it('scopes every theme by name and the default one without attribute', () => {
    const { css } = compile({ defaultTheme: 'dots' })
    expect(css).toContain('[data-charpente-loading][data-charpente-theme="cyberpunk"]')
    expect(css).toContain('[data-charpente-loading]:not([data-charpente-theme])')
  })

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

  it('uses the media query for dark tokens by default', () => {
    expect(compile().css).toContain('@media (prefers-color-scheme: dark)')
  })

  it('uses the given selector for dark tokens instead of the media query', () => {
    const { css } = compile({ colorScheme: { dark: '[data-theme="dark"]' } })
    expect(css).toContain('[data-theme="dark"] {')
    expect(css).not.toContain('@media (prefers-color-scheme: dark)')
  })

  it('lets a custom theme extend a built-in one', () => {
    const config = defineCharpente({
      defaultTheme: 'mine',
      themes: { mine: { extends: 'solid', paint: { text: { fill: 'red' } } } },
    })
    const { css } = compile(config)
    expect(css).toContain('data-charpente-theme="mine"')
    expect(css).toContain('background-image: var(--charpente-shine-layer, none), red !important')
  })

  it('registers custom motions and keyframes', () => {
    const { css } = compile({
      motions: { blink: { duration: '1s', keyframes: { '50%': { opacity: '0' } } } },
    })
    expect(css).toContain('@keyframes charpente-blink')
    expect(css).toContain('[data-charpente-motion="blink"]')
  })

  it('throws on an unknown theme', () => {
    expect(() => compile({ defaultTheme: 'nope' })).toThrow('unknown theme "nope"')
  })

  it('throws on an unknown motion', () => {
    expect(() => compile({ motion: 'nope' })).toThrow('unknown motion "nope"')
  })

  it('rejects a schedule entry that uses an unknown theme', () => {
    expect(() =>
      compile({ schedule: [{ theme: 'nope', from: '10-15', to: '11-02' }] }),
    ).toThrow('schedule uses unknown theme "nope"')
  })

  it('rejects a schedule date that is not MM-DD', () => {
    expect(() =>
      compile({ schedule: [{ theme: 'web', from: '2026-10-15', to: '11-02' }] }),
    ).toThrow('must look like MM-DD')
  })

  it('rejects an unknown time zone', () => {
    expect(() => compile({ timeZone: 'Mars/Olympus' })).toThrow('unknown time zone')
  })

  it('throws on a theme extending itself', () => {
    expect(() =>
      compile({ defaultTheme: 'loop', themes: { loop: { extends: 'loop' } } }),
    ).toThrow('extends itself')
  })

  it('warns when two default motions animate the same property', () => {
    const { warnings } = compile({ motion: ['pulse', 'wave'] })
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

  it('hides the text of every element, including mixed content', () => {
    expect(compile().css).toMatch(/\[data-charpente-loading\] \* \{\s*-webkit-text-fill-color: transparent/)
  })

  it('keeps the padding of text leaves out of the paint', () => {
    expect(compile().css).toContain('background-clip: content-box !important')
  })

  it('hides the drawing inside svg so only the svg box is painted', () => {
    expect(compile().css).toMatch(/\[data-charpente-loading\] svg \* \{\s*visibility: hidden/)
  })

  it('hides children of a block so only the block is painted', () => {
    expect(compile().css).toContain('[data-charpente-block] > *')
  })
})
