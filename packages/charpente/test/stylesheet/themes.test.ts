import { describe, expect, it } from 'vitest'
import { compile, defineCharpente } from '../../src'

describe('compile themes', () => {
  it('wraps the rules in a cascade layer', () => {
    expect(compile().css).toContain('@layer charpente {')
  })

  it('scopes every theme by name and the default one without attribute', () => {
    const { css } = compile({ defaultTheme: 'dots' })
    expect(css).toContain('[data-charpente-loading][data-charpente-theme="cyberpunk"]')
    expect(css).toContain('[data-charpente-loading]:not([data-charpente-theme])')
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

  it('throws on an unknown theme', () => {
    expect(() => compile({ defaultTheme: 'nope' })).toThrow('unknown theme "nope"')
  })

  it.each(['glass', 'blueprint', 'halftone', 'stripes', 'neon', 'aurora', 'brutalist', 'sketch', 'topo', 'waves', 'music', 'developer', 'wellness'])(
    'ships the %s theme with a paint for every leaf type',
    (name) => {
      const { css } = compile({ defaultTheme: name })
      const scope = `[data-charpente-loading][data-charpente-theme="${name}"]`
      for (const selector of [':is(img, svg', ':is(button, input', '[data-charpente-block]', ':not(:has(*))']) {
        expect(css).toContain(`${scope} ${selector}`)
      }
    },
  )

  it('throws on a theme extending itself', () => {
    expect(() =>
      compile({ defaultTheme: 'loop', themes: { loop: { extends: 'loop' } } }),
    ).toThrow('extends itself')
  })

  it('ships only the included themes plus default, scheduled and custom ones', () => {
    const { css } = compile({
      defaultTheme: 'solid',
      include: ['dots'],
      schedule: [{ theme: 'blueprint', from: '12-15', to: '12-26' }],
      themes: { mine: { extends: 'solid' } },
    })
    for (const name of ['solid', 'dots', 'blueprint', 'mine']) expect(css).toContain(`data-charpente-theme="${name}"`)
    for (const name of ['cyberpunk', 'neon']) expect(css).not.toContain(`data-charpente-theme="${name}"`)
  })

  it('rejects an include entry that is not a theme', () => {
    expect(() => compile({ include: ['nope'] })).toThrow('include uses unknown theme "nope"')
  })
})
