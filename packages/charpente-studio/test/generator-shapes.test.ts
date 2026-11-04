import { compile } from 'charpente'
import { describe, expect, it } from 'vitest'
import { emptyState, normalizeState, sanitizeState, sourceToState, startState, stateToTheme, themeSource, type GeneratorState } from '../src/generator'
import { SHAPE_LIBRARY } from '../src/generator/shapes'
import { previewCss } from '../src/generator/ui/preview'

const shaped = (shape: string, roles: GeneratorState['leaves']['text']['roles'] = [], types: ('text' | 'media' | 'block' | 'control')[] = ['media', 'block']): GeneratorState => {
  const state = structuredClone(emptyState())
  for (const type of types) Object.assign(state.leaves[type], { shape, roles })
  return state
}

describe('layered shapes in the generator', () => {
  it('writes the shape name on the leaves that use it', () => {
    const theme = stateToTheme(shaped('gift'))
    expect(theme.paint?.media?.shape).toBe('gift')
    expect(theme.paint?.block?.shape).toBe('gift')
    expect(theme.paint?.text?.shape).toBeUndefined()
    expect(themeSource(shaped('gift'))).toContain("shape: 'gift'")
  })

  it('keeps the short format with a shape on every leaf', () => {
    const theme = stateToTheme(shaped('gift', [], ['text', 'media', 'block', 'control']))
    expect(theme.pattern).toBe('solid')
    expect(theme.paint?.control?.shape).toBe('gift')
  })

  it('writes the full shape only when a layer role changed', () => {
    const roles = SHAPE_LIBRARY.gift!.layers.map((layer, index) => (index === 0 ? 'accent' : layer.role))
    const shape = stateToTheme(shaped('gift', roles)).paint?.media?.shape
    expect(typeof shape).toBe('object')
    expect(typeof shape === 'object' && shape.layers[0]?.role).toBe('accent')
    const same = SHAPE_LIBRARY.gift!.layers.map((layer) => layer.role)
    expect(normalizeState(shaped('gift', same)).leaves.media.roles).toEqual([])
  })

  it('reloads a generated file with the shape and its roles', () => {
    const roles = SHAPE_LIBRARY.gift!.layers.map((layer, index) => (index === 1 ? 'detail' : layer.role))
    for (const state of [shaped('gift'), shaped('bubble'), shaped('gift', roles)]) {
      const normal = normalizeState(state)
      const again = sourceToState(themeSource(normal), normal.name).state
      expect(again.leaves.media.shape).toBe(normal.leaves.media.shape)
      expect(again.leaves.media.roles).toEqual(normal.leaves.media.roles)
      expect(themeSource(again)).toBe(themeSource(normal))
    }
  })

  it('refuses unknown shapes and mismatched roles', () => {
    expect(() => sanitizeState(shaped('nope'))).toThrow('unknown shape')
    expect(() => sanitizeState(shaped('gift', ['accent']))).toThrow('do not match')
    const bad = shaped('gift', SHAPE_LIBRARY.gift!.layers.map(() => 'neon' as never))
    expect(() => sanitizeState(bad)).toThrow('unknown layer role')
  })

  it('accepts states saved before shapes existed', () => {
    const old = structuredClone(emptyState()) as unknown as { leaves: Record<string, Record<string, unknown>> }
    for (const leaf of Object.values(old.leaves)) {
      delete leaf.shape
      delete leaf.roles
    }
    expect(sanitizeState(old).leaves.text.shape).toBe('')
  })

  it('compiles the preview and the generated theme to the same mask', () => {
    const state = shaped('gift')
    const preview = previewCss(state, {}, false)
    expect(preview).toContain('mask-image: url("data:image/svg+xml')
    const real = compile({ themes: { [state.name]: stateToTheme(state) }, defaultTheme: state.name }).css
    expect(real).toContain('mask-image: url("data:image/svg+xml')
    expect(compile({ themes: { x: stateToTheme(shaped('gift')) }, defaultTheme: 'x', include: ['x'] }).css).toContain('mask-image')
  })

  it('extends a built-in theme and only adds the shape', () => {
    const state = structuredClone(startState('cyberpunk'))
    Object.assign(state.leaves.block, { shape: 'card' })
    expect(stateToTheme(state)).toEqual({ extends: 'cyberpunk', paint: { block: { shape: 'card' } } })
  })
})

describe('wrapped gifts in the generator', () => {
  it('lists both stretched variants with their fixed bow and writes their names', () => {
    for (const name of ['gift-wrap', 'gift-wrap-band']) {
      expect(SHAPE_LIBRARY[name]?.stretch).toBe(true)
      expect(SHAPE_LIBRARY[name]?.fixed?.layers.length).toBeGreaterThan(0)
      expect(themeSource(shaped(name))).toContain(`shape: '${name}'`)
      expect(previewCss(shaped(name), {}, false)).toContain('mask-image')
    }
  })
})
