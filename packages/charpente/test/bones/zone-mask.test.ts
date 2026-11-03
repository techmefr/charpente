import { describe, expect, it } from 'vitest'
import { bonesCss } from '../../src/bones'
import type { BonesData, ZoneBones } from '../../src'

type Kind = 'block' | 'control' | 'text' | 'media'

const bone = (kind: Kind, y: number): ZoneBones['bones'][number] => ({
  x: 0,
  y,
  width: 100,
  height: 20,
  radius: 4,
  kind,
})

const css = (...kinds: Kind[]): string => {
  const data: BonesData = {
    zone: { '1280': { width: 400, height: 200, bones: kinds.map((kind, index) => bone(kind, index * 30)) } },
  }
  return bonesCss(data)
}

const ZONE = '[data-charpente-capture="zone"]'
const MASK = /\n  mask: /
const zoneRule = (output: string): string =>
  output.split('\n}').find((rule) => rule.includes(`${ZONE} {`)) ?? ''

describe('zone mask', () => {
  it('does not mask a zone that only has text bones', () => {
    const output = css('text', 'text')
    expect(zoneRule(output)).not.toMatch(MASK)
    expect(zoneRule(output)).toContain('min-height: 200px;')
    expect(output).toContain(`${ZONE}::before {`)
    expect(output).not.toContain('::after')
  })

  it('does not mask a zone that only has media bones', () => {
    const output = css('media')
    expect(zoneRule(output)).not.toMatch(MASK)
    expect(output).toContain(`${ZONE}::after {`)
    expect(output).not.toContain('::before')
  })

  it('masks a zone that only has block and control bones with a single layer', () => {
    const output = css('block', 'control')
    expect(zoneRule(output)).toMatch(MASK)
    expect(zoneRule(output).match(/url\(/g)).toHaveLength(2)
    expect(output).not.toContain('::before')
    expect(output).not.toContain('::after')
  })

  it('keeps the text and media areas inside the mask of a mixed zone', () => {
    const rule = zoneRule(css('block', 'text', 'media'))
    const match = /\n  mask: url\("data:image\/svg\+xml,([^"]+)"\)[^,]*, url\("data:image\/svg\+xml,([^"]+)"\)/.exec(rule)
    expect(match).not.toBeNull()
    expect(decodeURIComponent(match?.[1] ?? '').match(/<rect/g)).toHaveLength(1)
    expect(decodeURIComponent(match?.[2] ?? '').match(/<rect/g)).toHaveLength(2)
    expect(rule).toContain('position: relative;')
  })
})
