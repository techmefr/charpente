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

  it.each(['halloween', 'christmas', 'winter', 'summer', 'spring', 'autumn', 'new-year', 'paper', 'glass', 'blueprint', 'halftone', 'stripes', 'scanline', 'neon', 'vegas', 'aurora', 'brutalist', 'sketch', 'topo', 'waves', 'valentine', 'birthday', 'pride', 'editorial', 'commerce', 'analytics', 'gaming', 'music', 'developer', 'travel', 'wellness'])(
    'ships the %s theme with a paint for every leaf type',
    (name) => {
      const { css } = compile({ defaultTheme: name })
      const scope = `[data-charpente-loading][data-charpente-theme="${name}"]`
      for (const selector of [':is(img, svg', ':is(button, input', '[data-charpente-block]', ':not(:has(*))']) {
        expect(css).toContain(`${scope} ${selector}`)
      }
    },
  )

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

  it('neutralises the host background color on every leaf', () => {
    expect(compile().css).toContain('background-color: transparent !important')
  })

  it('applies theme dark tokens under the media query', () => {
    const { css } = compile({ defaultTheme: 'winter' })
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\) \{\s*\[data-charpente-loading\]\[data-charpente-theme="winter"\]/)
  })

  it('applies theme dark tokens under the dark selector and keeps forced light out', () => {
    const selector = compile({ defaultTheme: 'winter', colorScheme: { dark: '[data-theme="dark"]' } }).css
    expect(selector).toContain('[data-theme="dark"] [data-charpente-loading][data-charpente-theme="winter"]')
    const media = compile({ defaultTheme: 'winter', colorScheme: { light: '[data-theme="light"]' } }).css
    expect(media).toContain('[data-charpente-theme="winter"]:not([data-theme="light"] *)')
    expect(media).toContain('[data-theme="light"] {')
  })

  it('matches motion names whatever their order in the attribute', () => {
    expect(compile().css).toContain(
      '[data-charpente-loading][data-charpente-motion~="glitch"][data-charpente-motion~="shimmer"]:not([data-charpente-motion~="pulse"])',
    )
  })

  it('ships only the included themes plus default, scheduled and custom ones', () => {
    const { css } = compile({
      defaultTheme: 'solid',
      include: ['dots'],
      schedule: [{ theme: 'christmas', from: '12-15', to: '12-26' }],
      themes: { mine: { extends: 'solid' } },
    })
    for (const name of ['solid', 'dots', 'christmas', 'mine']) expect(css).toContain(`data-charpente-theme="${name}"`)
    for (const name of ['cyberpunk', 'halloween']) expect(css).not.toContain(`data-charpente-theme="${name}"`)
  })

  it('rejects an include entry that is not a theme', () => {
    expect(() => compile({ include: ['nope'] })).toThrow('include uses unknown theme "nope"')
  })

  it('hides children of a block so only the block is painted', () => {
    expect(compile().css).toContain('[data-charpente-block] > *')
  })
})

describe('ui library resilience', () => {
  it('hides text decorations such as link underlines', () => {
    expect(compile().css).toContain('text-decoration-color: transparent !important')
  })

  it('removes frames from table cells and rows', () => {
    const { css } = compile()
    expect(css).toMatch(/\[data-charpente-loading\] :is\(td, th\) \{\s*box-shadow: none !important/)
    expect(css).toMatch(/:is\(tr, thead, tbody, tfoot, table\) \{\s*border-color: transparent !important/)
  })

  it('keeps the inner parts of controls out of the text paint', () => {
    expect(compile().css).toContain(':not(:is(button, [role="button"], select, fieldset, legend, [role="combobox"]) *)')
  })
})
