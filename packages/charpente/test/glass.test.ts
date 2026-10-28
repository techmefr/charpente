import { describe, expect, it } from 'vitest'
import { compile, createGlassTheme } from '../src'

describe('glass themes', () => {
  it.each(['glass', 'frost', 'smoked'])('compiles %s with backdrop blur on every paint type', (name) => {
    const { css } = compile({ defaultTheme: name, include: [name], motion: 'none' })
    expect(css.match(/(?<!-)backdrop-filter:/g)).toHaveLength(4)
    expect(css.match(/-webkit-backdrop-filter:/g)).toHaveLength(4)
    expect(css).toContain('color-mix(in srgb, var(--charpente-glass-tint,')
    expect(css).not.toMatch(/\n  opacity:/)
  })

  it('compiles configurable glass and inherited overrides', () => {
    const { css } = compile({
      defaultTheme: 'custom', include: [],
      themes: {
        custom: createGlassTheme({ blur: '18px', opacity: 0.15, tint: '#b8c4ff', reflection: 0.2 }),
        child: { extends: 'custom', paint: { control: { style: { borderRadius: '999px' } } } },
      },
    })
    expect(css).toContain('blur(var(--charpente-glass-blur, 18px))')
    expect(css).toContain('var(--charpente-glass-opacity, 0.15)')
    expect(css).toContain('var(--charpente-glass-tint, #b8c4ff)')
    expect(css).toContain('var(--charpente-glass-reflection, 0.2)')
    expect(css).toContain('border-radius: 999px')
  })

  it.each([-0.1, 1.1, Number.NaN, Number.POSITIVE_INFINITY])('rejects invalid opacity or reflection %s', (value) => {
    expect(() => createGlassTheme({ opacity: value })).toThrow('opacity must be between 0 and 1')
    expect(() => createGlassTheme({ reflection: value })).toThrow('reflection must be between 0 and 1')
  })
})
