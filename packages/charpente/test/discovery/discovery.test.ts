import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { discoverThemes, themeAssets } from '../../src/discovery'

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

  it('inlines the SVG file of an image border, in the theme and in its variants', async () => {
    const root = mkdtempSync(join(tmpdir(), 'charpente-'))
    mkdirSync(join(root, 'themes', 'gift'), { recursive: true })
    writeFileSync(join(root, 'themes', 'gift', 'border.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>')
    writeFileSync(
      join(root, 'themes', 'gift', 'theme.js'),
      "export default { pattern: 'dots', border: { image: './border.svg' }, variants: { red: { border: { image: './border.svg', slice: 10 } } } }",
    )
    const themes = await discoverThemes(root)
    expect(themes.gift?.border).toMatchObject({ image: '<svg xmlns="http://www.w3.org/2000/svg"/>' })
    expect(themes.gift?.variants?.red?.border).toMatchObject({ image: '<svg xmlns="http://www.w3.org/2000/svg"/>', slice: 10 })
    expect(themeAssets(root).map((file) => file.endsWith('border.svg'))).toEqual([true])
  })

  it('returns nothing when there is no themes directory', async () => {
    expect(await discoverThemes(mkdtempSync(join(tmpdir(), 'charpente-')))).toEqual({})
  })
})
