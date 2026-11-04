import { build } from 'esbuild'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import * as shapes from '../../src/shape-exports'

const DIST = resolve(import.meta.dirname, '..', '..', 'dist')

const bundle = async (source: string): Promise<string> => {
  const { outputFiles } = await build({
    stdin: { contents: source, resolveDir: DIST },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    alias: { 'charpente/lite': resolve(DIST, 'lite.js'), 'charpente/shapes': resolve(DIST, 'shapes.js') },
  })
  return outputFiles[0]?.text ?? ''
}

describe('shape tree shaking', () => {
  it('keeps one imported shape and drops the others', async () => {
    const code = await bundle(`
      import { compile } from 'charpente/lite'
      import { label } from 'charpente/shapes'
      console.log(compile({ shapes: { label }, themes: { t: { paint: { block: { shape: 'label' } } } } }).css)
    `)
    expect(code).toContain('M44 8H186')
    for (const other of ['M69 54H91V152H69Z', 'M44 104L38 144', 'M18 48']) expect(code).not.toContain(other)
  })

  it('bundles each shape on its own', async () => {
    const all = await bundle(`import * as shapes from 'charpente/shapes'
console.log(shapes)`)
    for (const name of Object.keys(shapes).filter((key) => ['gift', 'giftWrap', 'giftWrapBand', 'card', 'avatar', 'label', 'bubble'].includes(key))) {
      const alone = await bundle(`import { ${name} } from 'charpente/shapes'
console.log(${name})`)
      expect(alone.length, name).toBeLessThan(all.length)
    }
  })
})
