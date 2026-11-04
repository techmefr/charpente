import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { discoverThemes } from '../../src/discovery'

describe('recipes', () => {
  const repositoryRoot = resolve(import.meta.dirname, '..', '..', '..', '..')
  const recipeNames = ['autumn', 'birthday', 'christmas', 'halloween', 'new-year', 'spring', 'summer', 'winter']

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

  it('draws the christmas gift border and ships its wrapping papers as variants', async () => {
    const recipes = await discoverThemes(repositoryRoot, 'recipes')
    const { css } = compile({ themes: recipes })
    expect(css).toContain('border-image: url("data:image/svg+xml')
    for (const paper of ['christmas', 'christmas-green', 'christmas-gold', 'christmas-snow']) {
      expect(css).toContain(`[data-charpente-theme="${paper}"]`)
    }
  })

  it('shapes christmas cards as snowy gifts and keeps the border on text and controls', async () => {
    const recipes = await discoverThemes(repositoryRoot, 'recipes')
    const { css } = compile({ themes: recipes })
    const rules = css.split('\n\n').filter((rule) => rule.includes('[data-charpente-theme="christmas"]'))
    const block = rules.find((rule) => rule.includes('[data-charpente-block]'))
    expect(block).toContain('mask-image')
    expect(block).toContain('border-image: none !important')
    expect(rules.find((rule) => rule.includes(':is(button, input'))).toContain('border-image: url(')
  })

  it('is not part of the built-in themes', () => {
    const { css } = compile()
    for (const name of ['christmas', 'halloween', 'winter']) expect(css).not.toContain(`data-charpente-theme="${name}"`)
  })
})
