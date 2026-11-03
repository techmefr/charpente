import { build } from 'esbuild'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import * as themes from '../../src/theme-exports'

const DIST = resolve(import.meta.dirname, '..', '..', 'dist')
const IMPORTED = '#16435a'
const OTHERS = ['#84a98c', '#101827', '#e9c46a', '#8593a8', '#9a7f52', '#22ff77']

const bundle = async (source: string): Promise<string> => {
  const { outputFiles } = await build({
    stdin: { contents: source, resolveDir: DIST },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    alias: {
      'charpente': resolve(DIST, 'index.js'),
      'charpente/lite': resolve(DIST, 'lite.js'),
      'charpente/themes': resolve(DIST, 'themes.js'),
    },
  })
  return outputFiles[0]?.text ?? ''
}

describe('tree shaking', () => {
  it('keeps one imported theme and drops every other one', async () => {
    const code = await bundle(`
      import { compile } from 'charpente/lite'
      import { cyberpunk } from 'charpente/themes'
      console.log(compile({ themes: { cyberpunk }, defaultTheme: 'cyberpunk' }).css)
    `)
    expect(code).toContain(IMPORTED)
    for (const other of OTHERS) expect(code).not.toContain(other)
  })

  it('keeps a glass theme without the other glass themes', async () => {
    const code = await bundle(`
      import { compile } from 'charpente/lite'
      import { frost } from 'charpente/themes'
      console.log(compile({ themes: { frost }, defaultTheme: 'frost' }).css)
    `)
    expect(code).toContain('24px')
    expect(code).not.toContain('#101827')
    expect(code).not.toContain(IMPORTED)
  })

  it('embeds every theme through the full entry', async () => {
    const code = await bundle(`
      import { compile } from 'charpente'
      console.log(compile().css)
    `)
    for (const theme of [IMPORTED, ...OTHERS]) expect(code).toContain(theme)
  })

  it('bundles each theme on its own', async () => {
    const all = await bundle(`import * as themes from 'charpente/themes'
console.log(themes)`)
    for (const name of Object.keys(themes)) {
      const alone = await bundle(`import { ${name} } from 'charpente/themes'
console.log(${name})`)
      expect(alone.length, name).toBeLessThan(all.length / 5)
    }
  })
})

