import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

const SOURCE = resolve(import.meta.dirname, '..', 'src')
const TESTS = resolve(import.meta.dirname)
const TECHNICAL = ['types', 'css', 'discovery']
const FUNCTIONAL = ['themes', 'motions', 'schedule', 'loading', 'stylesheet']
const LAYERS = [...TECHNICAL, ...FUNCTIONAL]
const MAX_FILE_LINES = 150
const MAX_FUNCTION_LINES = 75

const filesOf = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    return statSync(path).isDirectory() ? filesOf(path) : [path]
  })

const layerOf = (file: string): string | undefined => {
  const [first] = relative(SOURCE, file).split(sep)
  return LAYERS.includes(first ?? '') ? first : undefined
}

const importsOf = (file: string): string[] =>
  [...readFileSync(file, 'utf8').matchAll(/(?:from|import)\s+'(\.[^']*)'/g)].map((match) => match[1] as string)

const targetLayer = (file: string, specifier: string): { layer: string | undefined; depth: number } => {
  const parts = relative(SOURCE, resolve(file, '..', specifier)).split(sep)
  const layer = LAYERS.includes(parts[0] ?? '') ? parts[0] : undefined
  return { layer, depth: parts.length }
}

const sources = filesOf(SOURCE).filter((file) => file.endsWith('.ts'))
const everyFile = [...sources, ...filesOf(TESTS).filter((file) => /\.(ts|tsx)$/.test(file))]

const longFunctions = (file: string): string[] => {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
  const found: string[] = []
  const visit = (node: ts.Node): void => {
    if (ts.isFunctionLike(node) && 'body' in node && node.body) {
      const start = source.getLineAndCharacterOfPosition(node.getStart()).line
      const end = source.getLineAndCharacterOfPosition(node.getEnd()).line
      if (end - start + 1 > MAX_FUNCTION_LINES) found.push(`${relative(SOURCE, file)}:${start + 1}`)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return found
}

describe('layers', () => {
  it('never lets a technical layer import a functional layer', () => {
    const offenders = sources
      .filter((file) => TECHNICAL.includes(layerOf(file) ?? ''))
      .flatMap((file) => importsOf(file).map((specifier) => ({ file, ...targetLayer(file, specifier) })))
      .filter(({ layer }) => layer !== undefined && FUNCTIONAL.includes(layer))
    expect(offenders.map(({ file }) => relative(SOURCE, file))).toEqual([])
  })

  it('reaches another layer through its index only', () => {
    const offenders = sources.filter((file) => layerOf(file) !== undefined).flatMap((file) =>
      importsOf(file)
        .map((specifier) => ({ file, specifier, ...targetLayer(file, specifier) }))
        .filter(({ layer, depth }) => layer !== undefined && layer !== layerOf(file) && depth > 1)
        .map(({ file: from, specifier }) => `${relative(SOURCE, from)} -> ${specifier}`),
    )
    expect(offenders).toEqual([])
  })

  it('keeps every layer free of catch-all names', () => {
    const entries = readdirSync(SOURCE, { withFileTypes: true }).filter((entry) => entry.isDirectory())
    expect(entries.map((entry) => entry.name).sort()).toEqual([...LAYERS].sort())
  })
})

describe('size limits', () => {
  it(`keeps every file under ${MAX_FILE_LINES} lines`, () => {
    const offenders = everyFile.filter((file) => readFileSync(file, 'utf8').split('\n').length > MAX_FILE_LINES)
    expect(offenders.map((file) => relative(SOURCE, file))).toEqual([])
  })

  it(`keeps every function under ${MAX_FUNCTION_LINES} lines`, () => {
    expect(everyFile.flatMap(longFunctions)).toEqual([])
  })
})
