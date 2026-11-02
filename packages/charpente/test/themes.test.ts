import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { compile, defineTheme, discoverThemes, expandTheme } from '../src'

const PAINT_TYPES = ['text', 'media', 'control', 'block'] as const

describe('short theme format', () => {
  it('expands colors, pattern and border into tokens and paint for every type', () => {
    const theme = expandTheme(defineTheme({ colors: ['#111111', '#222222'], pattern: 'dots', border: '1px solid red' }))
    expect(theme.tokens).toMatchObject({ base: '#111111', strong: '#222222' })
    for (const type of PAINT_TYPES) {
      expect(theme.paint?.[type]?.fill).toContain('radial-gradient')
      expect(theme.paint?.[type]?.style).toMatchObject({ border: '1px solid red' })
    }
  })

  it('lets an explicit paint override the expanded one', () => {
    const theme = expandTheme({ pattern: 'dots', paint: { text: { fill: 'red' } } })
    expect(theme.paint?.text?.fill).toBe('red')
    expect(theme.paint?.media?.fill).toContain('radial-gradient')
  })

  it('rejects an unknown pattern', () => {
    expect(() => expandTheme({ pattern: 'nope' })).toThrow('unknown pattern "nope"')
  })

  it('compiles a short theme declared in the config', () => {
    const { css } = compile({ themes: { aurore: { colors: ['#fde8e8', '#f5c2c2'], pattern: 'stripes' } } })
    expect(css).toContain('[data-charpente-theme="aurore"]')
  })
})

describe('theme discovery', () => {
  it('declares one theme per folder of the themes directory', async () => {
    const root = mkdtempSync(join(tmpdir(), 'charpente-'))
    mkdirSync(join(root, 'themes', 'aurore'), { recursive: true })
    mkdirSync(join(root, 'themes', 'empty'), { recursive: true })
    writeFileSync(join(root, 'themes', 'aurore', 'theme.js'), "export default { colors: ['#fff', '#eee'], pattern: 'grid' }")
    const themes = await discoverThemes(root)
    expect(Object.keys(themes)).toEqual(['aurore'])
    expect(themes.aurore).toMatchObject({ pattern: 'grid' })
  })

  it('returns nothing when there is no themes directory', async () => {
    expect(await discoverThemes(mkdtempSync(join(tmpdir(), 'charpente-')))).toEqual({})
  })
})
