import { describe, expect, it } from 'vitest'
import { compile } from '../../src'

describe('compile schedule validation', () => {
  it('rejects a schedule entry that uses an unknown theme', () => {
    expect(() =>
      compile({ schedule: [{ theme: 'nope', from: '10-15', to: '11-02' }] }),
    ).toThrow('schedule uses unknown theme "nope"')
  })

  it('rejects a schedule date that is not MM-DD', () => {
    expect(() =>
      compile({ schedule: [{ theme: 'web', from: '2026-10-15', to: '11-02' }] }),
    ).toThrow('must look like MM-DD')
  })

  it('rejects an unknown time zone', () => {
    expect(() => compile({ timeZone: 'Mars/Olympus' })).toThrow('unknown time zone')
  })
})
