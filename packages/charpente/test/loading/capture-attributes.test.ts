import { describe, expect, it } from 'vitest'
import { loadingAttributes } from '../../src/loading'

describe('capture attributes', () => {
  it('marks the element as a block and names the zone to capture', () => {
    const { attributes } = loadingAttributes({ loading: false, capture: 'team' })
    expect(attributes).toEqual({ 'data-charpente-block': '', 'data-charpente-capture': 'team' })
  })

  it('adds nothing without a capture name', () => {
    expect(loadingAttributes({ loading: false }).attributes).toEqual({})
  })
})
