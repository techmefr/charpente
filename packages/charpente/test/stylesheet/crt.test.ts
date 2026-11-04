import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { compile as liteCompile } from '../../src/lite'
import { crt } from '../../src/theme-exports'

const bones = { card: { '1280': { width: 100, height: 40, bones: [{ x: 0, y: 0, width: 100, height: 40, radius: 4, kind: 'block' as const }] } } }

describe('crt motion', () => {
  it('flickers the container and breathes the leaves', () => {
    const { css } = compile({ motion: 'crt' })
    expect(css).toContain('@keyframes charpente-crt-container')
    expect(css).toMatch(/\[data-charpente-loading\]\[data-charpente-motion="crt"\][^{]*\{\s*animation: charpente-crt-container calc\(5s \* var\(--charpente-speed, 1\)\)/)
    expect(css).toContain('drop-shadow(0 0 4px var(--charpente-accent, #4ade80))')
  })

  it('draws scanlines, mask and vignette on an overlay layer', () => {
    const { css } = compile({ motion: 'crt' })
    expect(css).toMatch(/\[data-charpente-motion="crt"\]::after,[^{]*::after \{[^}]*pointer-events: none[^}]*repeating-linear-gradient/)
    expect(css).toContain('var(--charpente-crt-mask, 0.05)')
    expect(css).toContain('var(--charpente-crt-vignette, 0.38)')
    expect(css).toContain('@keyframes charpente-crt-overlay')
  })

  it('scrolls the overlay only when motion is allowed and scales it with the speed', () => {
    const { css } = compile({ motion: 'crt' })
    const media = css.slice(css.indexOf('@media (prefers-reduced-motion: no-preference)'))
    expect(media).toContain('animation: charpente-crt-overlay calc(7s * var(--charpente-speed, 1)) linear')
    const staticRule = css.split('}').find((rule) => rule.includes('::after') && rule.includes('background-image') && !rule.includes('animation'))
    expect(staticRule).toBeDefined()
  })

  it('works in capture mode', () => {
    const { css } = compile({ motion: 'crt', bones })
    expect(css).toMatch(/\[data-charpente-motion="crt"\][^{]*\{\s*animation: charpente-crt-container/)
  })

  it('adds nothing when the motion is not used', () => {
    const css = compile().css
    expect(css).toContain('@keyframes charpente-crt-overlay')
    expect(css).not.toMatch(/\[data-charpente-loading\]:not\(\[data-charpente-motion\]\)::after/)
  })
})

describe('crt theme', () => {
  it('is the default motion of the theme only', () => {
    const { css } = compile({ include: ['crt'] })
    expect(css).toMatch(/\[data-charpente-theme="crt"\]:not\(\[data-charpente-motion\]\)[^{]*\{\s*animation: charpente-reveal[^;]*charpente-crt /)
    expect(css).toMatch(/\[data-charpente-theme="crt"\]:not\(\[data-charpente-motion\]\)::after/)
  })

  it('uses the motion of the theme as the global default when crt is the default theme', () => {
    const { css } = compile({ defaultTheme: 'crt' })
    expect(css).toContain('[data-charpente-loading]:not([data-charpente-theme]):not([data-charpente-motion])')
  })

  it('ships an amber variant that keeps the motion', () => {
    const { css } = compile({ include: ['crt-amber'] })
    expect(css).toContain('data-charpente-theme="crt-amber"')
    expect(css).toContain('#fbbf24')
    expect(css).toMatch(/data-charpente-theme="crt-amber"\]:not\(\[data-charpente-motion\]\)[^{]*\{\s*animation:/)
  })

  it('lets an explicit motion win over the theme default', () => {
    expect(compile({ include: ['crt'] }).css).toContain('[data-charpente-motion="none"]')
  })

  it('compiles on its own through the lite entry', () => {
    const { css } = liteCompile({ themes: { crt }, defaultTheme: 'crt' })
    expect(css).toContain('#0f4a25')
    expect(css).toContain('charpente-crt-container')
  })

  it('rounds the shapes like a tube', () => {
    const { css } = compile({ include: ['crt'] })
    expect(css).toContain('border-radius: 9% / 14%')
  })
})
