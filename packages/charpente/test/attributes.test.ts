import { describe, expect, it } from 'vitest'
import { motionAttribute } from '../src'

describe('motionAttribute', () => {
  it('drops none and duplicates so selectors can match', () => {
    expect(motionAttribute(['none', 'shimmer', 'shimmer'])).toBe('shimmer')
  })

  it('maps an empty list or an empty string to none', () => {
    expect(motionAttribute([])).toBe('none')
    expect(motionAttribute('')).toBe('none')
  })
})
