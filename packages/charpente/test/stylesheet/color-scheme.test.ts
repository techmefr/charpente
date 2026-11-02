import { describe, expect, it } from 'vitest'
import { compile } from '../../src'

describe('compile color scheme', () => {
  it('uses the media query for dark tokens by default', () => {
    expect(compile().css).toContain('@media (prefers-color-scheme: dark)')
  })

  it('uses the given selector for dark tokens instead of the media query', () => {
    const { css } = compile({ colorScheme: { dark: '[data-theme="dark"]' } })
    expect(css).toContain('[data-theme="dark"] {')
    expect(css).not.toContain('@media (prefers-color-scheme: dark)')
  })

  const winter = { winter: { extends: 'solid', dark: { shine: 'rgba(255,255,255,0.16)' } } }

  it('applies theme dark tokens under the media query', () => {
    const { css } = compile({ defaultTheme: 'winter', themes: winter })
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\) \{\s*\[data-charpente-loading\]\[data-charpente-theme="winter"\]/)
  })

  it('applies theme dark tokens under the dark selector and keeps forced light out', () => {
    const selector = compile({ defaultTheme: 'winter', themes: winter, colorScheme: { dark: '[data-theme="dark"]' } }).css
    expect(selector).toContain('[data-theme="dark"] [data-charpente-loading][data-charpente-theme="winter"]')
    const media = compile({ defaultTheme: 'winter', themes: winter, colorScheme: { light: '[data-theme="light"]' } }).css
    expect(media).toContain('[data-charpente-theme="winter"]:not([data-theme="light"] *)')
    expect(media).toContain('[data-theme="light"] {')
  })
})
