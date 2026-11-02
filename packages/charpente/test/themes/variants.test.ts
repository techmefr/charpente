import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { withVariants } from '../../src/themes'

describe('theme variants', () => {
  it('derives one theme per variant that replaces the fields it gives', () => {
    const themes = withVariants({ gift: { colors: ['#111111', '#222222'], pattern: 'dots', variants: { green: { colors: ['#00ff00', '#00aa00'] } } } })
    expect(Object.keys(themes)).toEqual(['gift', 'gift-green'])
    expect(themes.gift?.variants).toBeUndefined()
    expect(themes['gift-green']).toMatchObject({ pattern: 'dots', colors: ['#00ff00', '#00aa00'] })
  })

  it('compiles the variants as themes of their own', () => {
    const { css } = compile({ themes: { gift: { colors: ['#111111', '#222222'], pattern: 'dots', variants: { green: { colors: ['#00ff00', '#00aa00'] } } } } })
    expect(css).toContain('[data-charpente-theme="gift-green"]')
    expect(css).toContain('--charpente-base: #00ff00')
  })
})
