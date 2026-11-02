import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { bonesCss } from '../../src/bones'
import { maskSvg } from '../../src/bones/mask'
import type { BonesData, ZoneBones } from '../../src'

const zone = (width: number, height: number): ZoneBones => ({
  width,
  height,
  bones: [
    { x: 0, y: 0, width: 100, height: 20, radius: 4 },
    { x: 0, y: 30, width: 40, height: 40, radius: 999 },
  ],
})

const data: BonesData = { hero: { '375': zone(375, 200), '768': zone(768, 180), '1280': zone(1280, 160) } }

describe('bones css', () => {
  it('draws one rect per bone in a mask scaled to the zone', () => {
    const svg = maskSvg(zone(375, 200))
    expect(svg).toContain('viewBox="0 0 375 200"')
    expect(svg).toContain('preserveAspectRatio="none"')
    expect(svg).toContain('<rect x="0" y="0" width="100" height="20" rx="4"')
  })

  it('caps the radius of a bone at half its smallest side', () => {
    expect(maskSvg(zone(375, 200))).toContain('width="40" height="40" rx="20"')
  })

  it('picks the captured breakpoint with media queries that do not overlap', () => {
    const css = bonesCss(data)
    expect(css).toContain('@media (max-width: 767px) {')
    expect(css).toContain('@media (min-width: 768px) and (max-width: 1279px) {')
    expect(css).toContain('@media (min-width: 1280px) {')
  })

  it('reserves the captured height and masks the zone while it is loading', () => {
    const css = bonesCss({ hero: { '1280': zone(1280, 160) } })
    expect(css).toContain('[data-charpente-loading] [data-charpente-capture="hero"] {')
    expect(css).toContain('min-height: 160px;')
    expect(css).toMatch(/mask: url\("data:image\/svg\+xml,[^"]+"\) 0 0 \/ 100% 100% no-repeat;/)
    expect(css).not.toContain('@media')
  })
})

describe('compile with bones', () => {
  it('adds the zones to the stylesheet only when bones are given', () => {
    expect(compile().css).not.toContain('data-charpente-capture')
    const { css } = compile({ bones: data })
    expect(css).toContain('[data-charpente-capture="hero"]')
    expect(css.indexOf('[data-charpente-capture="hero"]')).toBeGreaterThan(css.indexOf('@layer charpente'))
  })
})
