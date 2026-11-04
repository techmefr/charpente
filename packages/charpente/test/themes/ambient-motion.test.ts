import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { fillDeclarations } from '../../src/stylesheet/paint'
import { flowLayout } from '../../src/themes/builtin/shapes'

const AMBIENT = ['waves', 'matrix', 'snow', 'petals', 'leaves', 'sparkle']

describe('ambient motions', () => {
  it('ships every ambient motion as a flow keyframe', () => {
    const { css } = compile()
    for (const name of AMBIENT) expect(css).toContain(`@keyframes charpente-${name} { from { --charpente-flow: 0 } to { --charpente-flow: 1 } }`)
    expect(css).toContain('@property --charpente-flow')
  })

  it('keeps the combinations of the classic motions intact', () => {
    const { css } = compile()
    expect(css).toContain('[data-charpente-motion~="glitch"][data-charpente-motion~="pulse"]:not([data-charpente-motion~="shimmer"])')
    expect(css).not.toContain('[data-charpente-motion~="waves"]')
    expect(css).toContain('[data-charpente-loading][data-charpente-motion="waves"]')
  })

  it('runs the motion of a theme instead of the shimmer when the config sets none', () => {
    const { css } = compile({ defaultTheme: 'waves', include: ['waves', 'solid'] })
    expect(css).toContain('[data-charpente-loading][data-charpente-theme="waves"]:not([data-charpente-motion]) :not(:has(*))')
    expect(css).toContain('[data-charpente-loading]:not([data-charpente-theme]):not([data-charpente-motion])')
    expect(css).toMatch(/charpente-waves calc\(10s \* var\(--charpente-speed, 1\)\) linear/)
    expect(css).toContain('--charpente-shine-layer: none')
  })

  it('lets the config motion win over the theme motion', () => {
    const { css } = compile({ defaultTheme: 'waves', include: ['waves'], motion: 'pulse' })
    expect(css).not.toContain('[data-charpente-theme="waves"]:not([data-charpente-motion]) :not(:has(*))')
  })

  it('inherits and overrides the motion through extends and variants', () => {
    const { css } = compile({
      themes: {
        base: { motion: 'snow', variants: { calm: { motion: 'petals' } } },
        child: { extends: 'base' },
      },
    })
    expect(css).toContain('[data-charpente-theme="child"]:not([data-charpente-motion])')
    expect(css).toContain('[data-charpente-theme="base-calm"]:not([data-charpente-motion])')
    expect(css).toMatch(/charpente-petals calc/)
  })

  it('rejects an unknown theme motion', () => {
    expect(() => compile({ include: [], themes: { odd: { motion: 'nope' } } })).toThrow('unknown motion "nope"')
  })

  it('has no ambient motion on a theme that declares none', () => {
    const { css } = compile({ defaultTheme: 'solid', include: ['solid'] })
    expect(css).not.toContain('[data-charpente-theme="solid"]:not([data-charpente-motion])')
  })
})

describe('layer position and repeat', () => {
  it('paints positions and repeats per layer with defaults for the others', () => {
    const body = fillDeclarations('block', { fill: 'url(a), url(b), red', position: 'left top, 1px 2px', repeat: 'no-repeat' }).join('\n')
    expect(body).toContain('background-position: var(--charpente-shine-x, -80%) 0, left top, 1px 2px, 0 0 !important')
    expect(body).toContain('background-repeat: no-repeat, no-repeat, repeat, repeat !important')
  })

  it('scrolls a layer by whole tiles so that the loop is seamless', () => {
    const { size, position } = flowLayout([{ size: [96, 52], dx: -1 }, { size: [10, 20], dy: 2 }], 0.5, 1)
    expect(size).toBe('auto, 48px 26px, 5px 10px')
    expect(position).toBe('0 0, calc(var(--charpente-flow) * -48px) calc(var(--charpente-flow) * 0px), calc(var(--charpente-flow) * 0px) calc(var(--charpente-flow) * 20px)')
  })
})
