import { describe, expect, it } from 'vitest'
import { motionAttribute } from '../src'

describe('motionAttribute', () => {
  it('leaves the attribute off when no motion is given', () => {
    expect(motionAttribute(undefined)).toBeUndefined()
  })

  it('keeps a single motion as is', () => {
    expect(motionAttribute('pulse')).toBe('pulse')
  })

  it('sorts several motions so they match the compiled selectors', () => {
    expect(motionAttribute(['shimmer', 'glitch'])).toBe('glitch shimmer')
  })

  it('maps an empty list to none', () => {
    expect(motionAttribute([])).toBe('none')
  })
})
