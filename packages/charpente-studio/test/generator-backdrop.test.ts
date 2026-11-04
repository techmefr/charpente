import { describe, expect, it } from 'vitest'
import { sourceToState } from '../src/generator/import'
import { decodeState, encodeState } from '../src/generator/share'
import { themeSource } from '../src/generator/source'
import { emptyState } from '../src/generator/state'
import { previewCss } from '../src/generator/ui/preview'

describe('generator backdrop', () => {
  it('keeps the backdrop in shared state, exported source and scoped preview', () => {
    const state = { ...emptyState(), backdrop: 'linear-gradient(45deg, #faf3e7, #a7bac7)' }
    expect(decodeState(encodeState(state))?.backdrop).toBe(state.backdrop)
    expect(sourceToState(themeSource(state), state.name).state.backdrop).toBe(state.backdrop)
    expect(previewCss(state, {}, false)).toContain(`background: ${state.backdrop};`)
  })
})
