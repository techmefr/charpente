import { describe, expect, it } from 'vitest'
import { nativeTheme } from '../../src'
import { cyberpunk } from '../../src/theme-exports'

describe('native theme', () => {
  it('gives the default colors and radius to the solid theme', () => {
    expect(nativeTheme('solid')).toEqual({
      light: { base: '#e5e7eb', strong: '#c4c8d0', shine: 'rgba(255, 255, 255, 0.7)' },
      dark: { base: '#2a2d34', strong: '#454a55', shine: 'rgba(255, 255, 255, 0.08)' },
      radius: 6,
    })
  })

  it('reads the colors and radius of a short-format theme', () => {
    const theme = nativeTheme('ocean', { ocean: { colors: ['#112233', '#445566'], pattern: 'dots', radius: '12px' } })
    expect(theme.light.base).toBe('#112233')
    expect(theme.light.strong).toBe('#445566')
    expect(theme.radius).toBe(12)
  })

  it('keeps the default colors when a theme refers to a css variable', () => {
    const theme = nativeTheme('tinted', { tinted: { colors: ['var(--brand)', '#445566'], pattern: 'solid' } })
    expect(theme.light.base).toBe('#e5e7eb')
    expect(theme.light.strong).toBe('#445566')
  })

  it('finds a variant and rejects an unknown theme', () => {
    const themes = { paper: { colors: ['#111111', '#222222'] as [string, string], pattern: 'solid', variants: { gold: { colors: ['#ccaa00', '#aa8800'] as [string, string] } } } }
    expect(nativeTheme('paper-gold', themes).light.base).toBe('#ccaa00')
    expect(() => nativeTheme('nope')).toThrow('unknown theme')
  })

  it('takes a theme object imported from charpente/themes', () => {
    const theme = nativeTheme('cyberpunk', { cyberpunk })
    expect(theme.light.base).toBe('#0b1426')
    expect(theme.radius).toBe(3)
  })

  it('resolves builtin themes by name in the full entry', () => {
    expect(nativeTheme('cyberpunk').light.base).toBe('#0b1426')
  })
})
