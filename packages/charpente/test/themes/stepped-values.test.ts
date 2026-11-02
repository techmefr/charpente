import { describe, expect, it } from 'vitest'
import { expandTheme } from '../../src'

describe('stepped theme values', () => {
  it('computes stepped values with step 1 for text and control and the scale for media and block', () => {
    const theme = expandTheme({
      pattern: { fill: (step) => `fill-${step}`, size: (step) => `${5 * step}px` },
      radius: (step) => `${2 * step}px`,
      style: { boxShadow: (step) => `0 0 ${step}px red`, outline: '1px solid red' },
    })
    expect(theme.paint?.text).toMatchObject({ fill: 'fill-1', size: '5px', style: { borderRadius: '2px', boxShadow: '0 0 1px red' } })
    expect(theme.paint?.control?.fill).toBe('fill-1')
    expect(theme.paint?.media).toMatchObject({ fill: 'fill-1.15', size: '5.75px', style: { borderRadius: '2.3px', boxShadow: '0 0 1.15px red', outline: '1px solid red' } })
    expect(theme.paint?.block?.fill).toBe('fill-1.15')
  })

  it('uses a custom scale for media and block', () => {
    const theme = expandTheme({ pattern: { fill: (step) => `fill-${step}` }, scale: 2 })
    expect(theme.paint?.media?.fill).toBe('fill-2')
    expect(theme.paint?.text?.fill).toBe('fill-1')
  })

  it('merges the style of an explicit paint into the expanded style', () => {
    const theme = expandTheme({ pattern: 'dots', radius: '6px', style: { boxShadow: 'none' }, paint: { text: { style: { borderRadius: '3px' } } } })
    expect(theme.paint?.text?.style).toEqual({ borderRadius: '3px', boxShadow: 'none' })
    expect(theme.paint?.media?.style).toEqual({ borderRadius: '6px', boxShadow: 'none' })
  })
})
