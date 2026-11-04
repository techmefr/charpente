import { describe, expect, it } from 'vitest'
import { compile, nativeTheme } from '../../src'
import { resolveTheme } from '../../src/themes'
import type { ThemeDef } from '../../src'

const TYPES = ['text', 'media', 'control', 'block'] as const

describe('hover theme format', () => {
  it('expands a token name into a flat fill for every type', () => {
    const { hover } = resolveTheme('t', { t: { hover: 'strong' } })
    for (const type of TYPES) expect(hover[type]?.fill).toBe('linear-gradient(var(--charpente-strong), var(--charpente-strong))')
  })

  it('expands any other string as a color', () => {
    expect(resolveTheme('t', { t: { hover: '#ff0000' } }).hover.text?.fill).toBe('linear-gradient(#ff0000, #ff0000)')
  })

  it('maps radius and border into style declarations', () => {
    const { hover } = resolveTheme('t', { t: { hover: { text: { radius: '9px', border: '1px solid red', style: { opacity: '.7' } } } } })
    expect(hover.text?.style).toEqual({ borderRadius: '9px', border: '1px solid red', opacity: '.7' })
    expect(hover.media).toBeUndefined()
  })

  it('merges the hover of a parent type by type and key by key', () => {
    const themes: Record<string, ThemeDef> = {
      parent: { hover: { text: { fill: 'red', style: { opacity: '.5', color: 'blue' } }, media: { fill: 'green' } } },
      child: { extends: 'parent', hover: { text: { style: { opacity: '.9' } } } },
    }
    const { hover } = resolveTheme('child', themes)
    expect(hover.text).toEqual({ fill: 'red', style: { opacity: '.9', color: 'blue' } })
    expect(hover.media?.fill).toBe('green')
  })

  it('lets a child refine a short parent hover', () => {
    const themes: Record<string, ThemeDef> = { parent: { hover: 'strong' }, child: { extends: 'parent', hover: { text: { fill: 'red' } } } }
    const { hover } = resolveTheme('child', themes)
    expect(hover.text?.fill).toBe('red')
    expect(hover.block?.fill).toContain('--charpente-strong')
  })

  it('inherits hoverMotion and lets a child override it', () => {
    const themes: Record<string, ThemeDef> = { parent: { hoverMotion: 'pause' }, child: { extends: 'parent' }, other: { extends: 'parent', hoverMotion: 'faster' }, plain: {} }
    expect(resolveTheme('child', themes).hoverMotion).toBe('pause')
    expect(resolveTheme('other', themes).hoverMotion).toBe('faster')
    expect(resolveTheme('plain', themes).hoverMotion).toBe('none')
  })

  it('compiles the inherited hover into the child stylesheet', () => {
    const themes: Record<string, ThemeDef> = { parent: { hover: 'strong' }, child: { extends: 'parent' } }
    const { css } = compile({ themes, defaultTheme: 'child' })
    expect(css).toContain('[data-charpente-theme="child"] [data-charpente-block]:hover')
  })
})

describe('hover on native', () => {
  it('ignores hover and hoverMotion without failing', () => {
    const colors: [string, string] = ['#112233', '#445566']
    const lively: ThemeDef = { colors, hover: 'strong', hoverMotion: 'pause' }
    expect(nativeTheme('lively', { lively })).toEqual(nativeTheme('lively', { lively: { colors } }))
  })
})
