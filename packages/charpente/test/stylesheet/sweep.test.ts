import { describe, expect, it } from 'vitest'
import { compile } from '../../src'

describe('sweep motion', () => {
  it('anchors the shine layer to the viewport so one band crosses the whole page', () => {
    const { css } = compile({ motion: 'sweep' })
    expect(css).toContain('--charpente-shine-attachment: fixed')
    expect(css).toContain('@keyframes charpente-sweep')
  })

  it('keeps the shine layer attached to each element for the other motions', () => {
    const { css } = compile({ motion: 'shimmer' })
    const unscoped = css.split('}').find((rule) => rule.includes(':not([data-charpente-motion])') && rule.includes('animation:'))
    expect(unscoped).toBeDefined()
    expect(unscoped).not.toContain('--charpente-shine-attachment')
    expect(css).toContain('background-attachment: var(--charpente-shine-attachment, scroll), scroll')
  })

  it('lets a custom motion choose its attachment', () => {
    const motions = { band: { duration: '1s', attachment: 'local', layer: 'linear-gradient(red, blue)', keyframes: { to: { '--charpente-shine-x': '100%' } } } }
    expect(compile({ motion: 'band', motions }).css).toContain('--charpente-shine-attachment: local')
  })
})
