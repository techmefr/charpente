import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { discoverThemes } from '../../src/discovery'

describe('recipes', () => {
  const repositoryRoot = resolve(import.meta.dirname, '..', '..', '..', '..')
  const recipeNames = ['autumn', 'birthday', 'christmas', 'halloween', 'new-year', 'pride', 'spring', 'summer', 'winter']

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

  it('wraps every christmas leaf in a snowy gift and ships its wrapping papers as variants', async () => {
    const recipes = await discoverThemes(repositoryRoot, 'recipes')
    const { css } = compile({ themes: recipes })
    expect(css).toContain('mask-image: url("data:image/svg+xml')
    for (const paper of ['christmas', 'christmas-green', 'christmas-cream', 'christmas-red', 'christmas-kraft-green']) {
      expect(css).toContain(`[data-charpente-theme="${paper}"]`)
    }
  })

  it('stretches a snowy gift over every christmas leaf type without a border', async () => {
    const recipes = await discoverThemes(repositoryRoot, 'recipes')
    const { css } = compile({ themes: recipes })
    const scope = '[data-charpente-loading][data-charpente-theme="christmas"]'
    for (const selector of [':is(img, svg', ':is(button, input', '[data-charpente-block]', ':not(:has(*))']) {
      const start = css.indexOf(`${scope} ${selector}`)
      const rule = css.slice(start, css.indexOf('}', start))
      expect(start, selector).toBeGreaterThan(-1)
      expect(rule, selector).toContain('mask-size: 100% 100%')
      expect(rule, selector).not.toContain('border-image')
    }
  })

  it('ships winter as a frosted glass and a snowy variant that wraps every leaf in a snow cap', async () => {
    const recipes = await discoverThemes(repositoryRoot, 'recipes')
    const { css } = compile({ themes: recipes })
    for (const theme of ['winter', 'winter-snow']) {
      const scope = `[data-charpente-loading][data-charpente-theme="${theme}"]`
      for (const selector of [':is(img, svg', ':is(button, input', '[data-charpente-block]', ':not(:has(*))']) {
        const start = css.indexOf(`${scope} ${selector}`)
        expect(start, `${theme} ${selector}`).toBeGreaterThan(-1)
        expect(css.slice(start, css.indexOf('}', start)), `${theme} ${selector}`).toContain('mask-image')
      }
    }
  })

  it('is not part of the built-in themes', () => {
    const { css } = compile()
    for (const name of ['christmas', 'halloween', 'winter']) expect(css).not.toContain(`data-charpente-theme="${name}"`)
  })
})
