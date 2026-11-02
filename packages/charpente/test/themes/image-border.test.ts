import { describe, expect, it } from 'vitest'
import { expandTheme } from '../../src'

const PAINT_TYPES = ['text', 'media', 'control', 'block'] as const

describe('theme image border', () => {
  it('draws an image border with border-image on every type', () => {
    const theme = expandTheme({ pattern: 'dots', border: { image: '<svg xmlns="http://www.w3.org/2000/svg"/>', slice: 20, width: '10px', repeat: 'stretch' } })
    for (const type of PAINT_TYPES) {
      expect(theme.paint?.[type]?.style).toMatchObject({ boxSizing: 'border-box', borderStyle: 'solid !important', borderWidth: '10px !important' })
      expect(theme.paint?.[type]?.style?.borderImage).toMatch(/^url\("data:image\/svg\+xml,.+"\) 20 \/ 10px stretch !important$/)
    }
  })

  it('rejects a border image that is neither SVG markup nor url()', () => {
    expect(() => expandTheme({ pattern: 'dots', border: { image: 'border.png' } })).toThrow('neither SVG markup nor url')
  })
})
