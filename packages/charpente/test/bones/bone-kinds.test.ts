import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { bonesCss } from '../../src/bones'
import type { BonesData } from '../../src'

const mixed: BonesData = {
  card: {
    '1280': {
      width: 400,
      height: 200,
      bones: [
        { x: 0, y: 0, width: 400, height: 40, radius: 4, kind: 'text' },
        { x: 0, y: 50, width: 100, height: 100, radius: 50, kind: 'media' },
        { x: 0, y: 160, width: 80, height: 30, radius: 15, kind: 'control' },
      ],
    },
  },
}

describe('bone kinds', () => {
  it('paints text and media bones through their own layer of the zone', () => {
    const css = bonesCss(mixed)
    expect(css).toContain('[data-charpente-capture="card"]::before {')
    expect(css).toContain('[data-charpente-capture="card"]::after {')
    expect(css).toContain('position: relative;')
  })

  it('keeps controls and blocks on the zone itself', () => {
    const rule = bonesCss(mixed).split('}')[0] ?? ''
    expect(rule).not.toContain('::before')
    const svg = decodeURIComponent(/svg\+xml,([^"]+)"/.exec(rule)?.[1] ?? '')
    expect(svg).toContain('width="80" height="30"')
    expect(svg).not.toContain('height="40"')
  })

  it('treats bones without a kind as blocks and adds no extra layer', () => {
    const css = bonesCss({ box: { '1280': { width: 10, height: 10, bones: [{ x: 0, y: 0, width: 10, height: 10, radius: 0 }] } } })
    expect(css).not.toContain('::before')
    expect(css).not.toContain('position: relative')
  })

  it('paints the layers with the text and media paint of the theme and animates them', () => {
    const { css } = compile({ bones: mixed, defaultTheme: 'dots' })
    expect(css).toMatch(/\[data-charpente-capture\]::before[^{]*\{[^}]*background-image/)
    expect(css).toMatch(/\[data-charpente-capture\]::after[^{]*\{[^}]*animation:/)
  })

  it('adds nothing for the layers without captured zones', () => {
    expect(compile().css).not.toContain('[data-charpente-capture]::before')
  })
})
