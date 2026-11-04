import { describe, expect, it } from 'vitest'
import { emptyState, normalizeState, sourceToState, startState, stateToTheme, themeSource } from '../src/generator'

const uniform = (state: ReturnType<typeof startState>, change: (leaf: ReturnType<typeof startState>['leaves']['text']) => void) => {
  for (const leaf of Object.values(state.leaves)) change(leaf)
  return state
}

describe('compact output', () => {
  it('writes the short format on top of a built-in theme when every leaf is alike', () => {
    const state = uniform(startState('cyberpunk'), (leaf) => Object.assign(leaf, { radius: '999px', fill: 'dots' }))
    expect(stateToTheme(state)).toEqual({ extends: 'cyberpunk', pattern: 'dots', radius: '999px' })
    expect(themeSource(state)).not.toContain('paint')
  })

  it('never writes a clip-path that changes nothing', () => {
    const state = uniform(startState('glass'), (leaf) => Object.assign(leaf, { radius: '16px', clip: '' }))
    expect(themeSource(state)).not.toContain('clipPath')
    expect(themeSource(uniform(emptyState(), (leaf) => (leaf.clip = 'none')))).not.toContain('clipPath')
  })

  it('keeps the parent radius when none is chosen by using the full format', () => {
    const state = uniform(startState('cyberpunk'), (leaf) => (leaf.fill = 'dots'))
    expect(stateToTheme(state).pattern).toBeUndefined()
    expect(stateToTheme(state).paint?.text?.style).toBeUndefined()
  })

  it('reloads the short format written on top of a theme', () => {
    const state = normalizeState(uniform(startState('cyberpunk'), (leaf) => Object.assign(leaf, { radius: '12px', fill: 'grid' })))
    expect(sourceToState(themeSource(state), state.name).state).toEqual(state)
  })
})
