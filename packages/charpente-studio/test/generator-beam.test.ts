import { describe, expect, it } from 'vitest'
import { configSource, emptyState, sanitizeState, speedSource, type GeneratorState } from '../src/generator'
import { MOTION_NAMES } from '../src/generator/state'

const withMotions = (motions: GeneratorState['motions'], extra: Partial<GeneratorState> = {}): GeneratorState => ({
  ...emptyState(),
  motions,
  ...extra,
})

describe('beam motions in the generator', () => {
  it('offers the beam motions in the choice', () => {
    expect(MOTION_NAMES).toEqual(expect.arrayContaining(['beam', 'border-beam', 'border-beam-line']))
  })

  it('writes the chosen beam motion into the config', () => {
    expect(configSource(withMotions(['border-beam']))).toContain("motion: 'border-beam'")
  })

  it('writes the beam size in degrees and the width in speed.css', () => {
    const css = speedSource(withMotions(['border-beam'], { beamSize: 90, beamWidth: 3 }))
    expect(css).toContain('--charpente-beam-size: 90deg;')
    expect(css).toContain('--charpente-beam-width: 3px;')
  })

  it('writes the line beam size in percent', () => {
    expect(speedSource(withMotions(['border-beam-line'], { beamSize: 30 }))).toContain('--charpente-beam-size: 30%;')
  })

  it('adds no beam variable without a border beam motion', () => {
    expect(speedSource(withMotions(['beam']))).not.toContain('--charpente-beam')
  })

  it('accepts a saved state without beam settings and rejects absurd ones', () => {
    const { beamSize, beamWidth, ...legacy } = emptyState()
    expect(sanitizeState(legacy).beamSize).toBe(70)
    expect(() => sanitizeState({ ...emptyState(), beamWidth: 99 })).toThrow()
  })
})
