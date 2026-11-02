import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
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

  it('applies the radius to every type and defaults to the radius token', () => {
    const rounded = expandTheme({ pattern: 'dots', radius: '4px' })
    const standard = expandTheme({ pattern: 'dots' })
    for (const type of PAINT_TYPES) {
      expect(rounded.paint?.[type]?.style).toMatchObject({ borderRadius: '4px' })
      expect(standard.paint?.[type]?.style).toMatchObject({ borderRadius: 'var(--charpente-radius)' })
    }
  })

  it('rejects an unknown pattern', () => {
    expect(() => expandTheme({ pattern: 'nope' })).toThrow('unknown pattern "nope"')
  })

  it('compiles a short theme declared in the config', () => {
    const { css } = compile({ themes: { aurore: { colors: ['#fde8e8', '#f5c2c2'], pattern: 'stripes' } } })
    expect(css).toContain('[data-charpente-theme="aurore"]')
  })
})

describe('recipes', () => {
  const repositoryRoot = resolve(import.meta.dirname, '..', '..', '..')
  const recipeNames = ['autumn', 'birthday', 'christmas', 'halloween', 'new-year', 'pride', 'spring', 'summer', 'valentine', 'winter']

  it('ships every recipe as a folder that compiles with a paint for every leaf type', async () => {
    const recipes = await discoverThemes(repositoryRoot, 'recipes')
    expect(Object.keys(recipes).sort()).toEqual(recipeNames)
    const { css } = compile({ themes: recipes })
    for (const name of recipeNames) {
      const scope = `[data-charpente-loading][data-charpente-theme="${name}"]`
      for (const selector of [':is(img, svg', ':is(button, input', '[data-charpente-block]', ':not(:has(*))']) {
        expect(css).toContain(`${scope} ${selector}`)
      }
    }
  })

  it('is not part of the built-in themes', () => {
    const { css } = compile()
    for (const name of ['christmas', 'halloween', 'winter']) expect(css).not.toContain(`data-charpente-theme="${name}"`)
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
