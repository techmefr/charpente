import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { shapeIdentifier, shapeSource, svgToShape } from '../../src/shapes'

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80">
  <rect x="10" y="30" width="80" height="50" fill="#2e9e5b"/>
  <path d="M10 30H90V40H10Z" fill="#1f7a43"/>
  <path d="M45 30h10v50H45Z" fill="#d62828"/>
  <circle cx="50" cy="26" r="8" fill="#f4c430"/>
  <path d="M0 0h5v5H0Z" fill="none"/>
</svg>`

describe('svg import', () => {
  it('groups paths by fill and gives the biggest group the body role', () => {
    const shape = svgToShape(SVG)
    expect(shape.viewBox).toEqual([100, 80])
    expect(shape.layers.map((layer) => layer.name)).toEqual(['#2e9e5b', '#1f7a43', '#d62828', '#f4c430'])
    expect(shape.layers.map((layer) => layer.role)).toEqual(['body', 'accent', 'accent2', 'detail'])
  })

  it('refuses an svg without usable shapes or size', () => {
    expect(() => svgToShape('<svg viewBox="0 0 1 1"><path d="M0 0" fill="none"/></svg>')).toThrow('no filled')
    expect(() => svgToShape('<svg><path d="M0 0h1v1Z"/></svg>')).toThrow('viewBox')
  })

  it('writes a typed module named after the file', () => {
    expect(shapeIdentifier('my-gift box')).toBe('myGiftBox')
    expect(shapeIdentifier('3d')).toBe('shape3d')
    expect(shapeSource('cake', svgToShape(SVG))).toContain('export const cake: ShapeDef = {')
  })

  it('runs as charpente shape and writes shapes/<name>.ts', () => {
    const dir = mkdtempSync(join(tmpdir(), 'charpente-shape-'))
    writeFileSync(join(dir, 'present.svg'), SVG)
    const cli = resolve(import.meta.dirname, '..', '..', 'dist', 'cli.js')
    execFileSync('node', [cli, 'shape', 'present.svg'], { cwd: dir })
    expect(readFileSync(join(dir, 'shapes', 'present.ts'), 'utf8')).toContain("role: 'body'")
  })
})
