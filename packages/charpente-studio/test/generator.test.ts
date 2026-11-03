import { builtinThemes, compile } from 'charpente'
import * as themeExports from 'charpente/themes'
import { describe, expect, it } from 'vitest'
import { FILLS, SHAPES, BUILTIN_NAMES, configSource, decodeState, emptyState, encodeState, normalizeState, sanitizeState, sourceToState, speedSource, startState, stateToTheme, themeSource, themesOf, type GeneratorState } from '../src/generator'
import { BORDER_KINDS } from '../src/generator/state'
import { parseLiteral, toLiteral } from '../src/generator/literal'
import { previewCss } from '../src/generator/ui/preview'

const edit = (change: (state: GeneratorState) => void, from: GeneratorState = emptyState()): GeneratorState => {
  const state = structuredClone(from)
  change(state)
  return state
}

const all = (state: GeneratorState, change: (leaf: GeneratorState['leaves']['text']) => void): void => {
  for (const leaf of Object.values(state.leaves)) change(leaf)
}

const roundTrip = (state: GeneratorState): GeneratorState => sourceToState(themeSource(state), state.name).state

describe('theme.ts generation', () => {
  it('writes the short format for an empty theme', () => {
    expect(themeSource(emptyState())).toBe(["import { defineTheme } from 'charpente'", '', 'export default defineTheme({', "  pattern: 'solid',", "  radius: '8px',", '})', ''].join('\n'))
  })

  it.each(SHAPES)('writes the $id shape', (shape) => {
    const state = edit((draft) => all(draft, (leaf) => Object.assign(leaf, { radius: shape.radius, clip: shape.clip })))
    const source = themeSource(state)
    expect(source).toContain(`radius: '${shape.radius}'`)
    if (shape.clip === 'none') expect(source).not.toContain('clipPath')
    else expect(source).toContain(`clipPath: '${shape.clip}'`)
  })

  it.each(FILLS)('writes the $id pattern', (preset) => {
    const state = edit((draft) => all(draft, (leaf) => (leaf.fill = preset.id)))
    const source = themeSource(state)
    if (preset.short) expect(source).toContain(`pattern: '${preset.id}'`)
    else expect(source).toContain(preset.fill)
  })

  it.each(BORDER_KINDS.filter((kind) => kind !== 'inherit'))('writes the %s border', (kind) => {
    const state = edit((draft) => all(draft, (leaf) => (leaf.border = { kind, width: 3, color: 'accent' })))
    const source = themeSource(state)
    expect(source).toMatch(/border|outline|boxShadow/)
    if (kind === 'none') expect(source).toContain("border: 'none'")
    else expect(source).toContain('var(--charpente-accent)')
  })

  it('writes a pasted fill with its size', () => {
    const state = edit((draft) => all(draft, (leaf) => Object.assign(leaf, { fill: 'custom', custom: 'linear-gradient(red, blue)', size: '10px 10px' })))
    expect(themeSource(state)).toContain("pattern: {\n    fill: 'linear-gradient(red, blue)',\n    size: '10px 10px',\n  }")
  })

  it('writes a different paint per leaf in the full format', () => {
    const state = edit((draft) => {
      draft.leaves.media.radius = '50%'
      draft.leaves.control.fill = 'dots'
    })
    const theme = stateToTheme(state)
    expect(theme.pattern).toBeUndefined()
    expect(theme.paint?.media?.style?.borderRadius).toBe('50%')
    expect(theme.paint?.control?.fill).toContain('radial-gradient')
    expect(theme.paint?.text?.style?.borderRadius).toBe('8px')
  })

  it('extends a built-in theme and only writes what changed', () => {
    const state = edit((draft) => draft.leaves.text.radius = '2px', startState('cyberpunk'))
    expect(stateToTheme(state)).toEqual({ extends: 'cyberpunk', paint: { text: { style: { borderRadius: '2px' } } } })
  })

  it('references the site tokens and never freezes a color by default', () => {
    const source = themeSource(edit((draft) => all(draft, (leaf) => (leaf.border = { kind: 'solid', width: 2, color: 'strong' }))))
    expect(source).toContain('var(--charpente-strong)')
    expect(source).not.toMatch(/#[0-9a-f]{6}/i)
  })

  it('writes fixed colors only when asked', () => {
    const theme = stateToTheme(edit((draft) => {
      draft.siteColors = false
      draft.colors.light.base = '#112233'
    }))
    expect(theme.tokens?.base).toBe('#112233')
    expect(theme.dark?.base).toBeDefined()
  })

  it('writes hover as a short token and as per-leaf paints', () => {
    const short = stateToTheme(edit((draft) => all(draft, (leaf) => (leaf.hover = 'accent'))))
    expect(short.hover).toBe('accent')
    const mixed = stateToTheme(edit((draft) => {
      draft.leaves.text.hover = 'accent'
      draft.leaves.block.hover = 'linear-gradient(red, blue)'
    }))
    expect(mixed.hover).toEqual({ text: { fill: 'linear-gradient(var(--charpente-accent), var(--charpente-accent))' }, block: { fill: 'linear-gradient(red, blue)' } })
  })

  it('writes the hover motion only when it matters', () => {
    expect(stateToTheme(emptyState()).hoverMotion).toBeUndefined()
    expect(stateToTheme(edit((draft) => (draft.hoverMotion = 'pause'))).hoverMotion).toBe('pause')
    expect(stateToTheme(edit((draft) => (draft.hoverMotion = 'none'), startState('glass'))).hoverMotion).toBe('none')
  })

  it('writes motion, timing and speed outside the theme file', () => {
    const state = edit((draft) => Object.assign(draft, { motions: ['glitch', 'pulse'], delay: 300, stagger: 40, speed: 1.5, name: 'neo' }))
    expect(configSource(state)).toContain("defaultTheme: 'neo'")
    expect(configSource(state)).toContain("motion: ['glitch', 'pulse']")
    expect(configSource(state)).toContain('delay: 300')
    expect(speedSource(state)).toContain('--charpente-speed: 1.5')
    expect(themeSource(state)).not.toContain('glitch')
  })
})

describe('import and export', () => {
  const states: [string, GeneratorState][] = [
    ['empty', emptyState()],
    ['pill with dashed border', edit((draft) => all(draft, (leaf) => Object.assign(leaf, { radius: '999px', border: { kind: 'dashed', width: 3, color: 'accent' } })))],
    ['cut corners and halftone', edit((draft) => all(draft, (leaf) => Object.assign(leaf, { clip: SHAPES[8]?.clip, fill: 'halftone' })))],
    ['pasted fill', edit((draft) => all(draft, (leaf) => Object.assign(leaf, { fill: 'custom', custom: 'repeating-linear-gradient(45deg, red 0 4px, blue 4px 8px)', size: '9px 9px' })))],
    ['per leaf', edit((draft) => {
      draft.leaves.media.radius = '50%'
      draft.leaves.control.border = { kind: 'outline', width: 2, color: 'accent2' }
      draft.leaves.block.border = { kind: 'diagonal', width: 4, color: 'strong' }
      draft.leaves.text.border = { kind: 'inset', width: 1, color: '#336699' }
    })],
    ['fixed colors', edit((draft) => {
      draft.siteColors = false
      draft.colors.light.accent = '#abcdef'
    })],
    ['hover', edit((draft) => {
      all(draft, (leaf) => (leaf.hover = 'accent'))
      draft.hoverMotion = 'faster'
    })],
    ['extends', edit((draft) => {
      draft.leaves.control.clip = 'none'
      draft.leaves.text.fill = 'topo'
      draft.hoverMotion = 'pause'
    }, startState('cyberpunk'))],
  ]

  it.each(states)('reloads %s from its own file', (_, state) => {
    const again = roundTrip(normalizeState(state))
    expect(themeSource(again)).toBe(themeSource(state))
    expect(again).toEqual(normalizeState(state))
  })

  it('reloads a hand-written file and reports what it cannot edit', () => {
    const { state, ignored } = sourceToState("import { defineTheme } from 'charpente'\n// note\nexport default defineTheme({\n  radius: '4px',\n  pattern: 'dots',\n  scale: 1.2,\n  style: { filter: 'blur(1px)' },\n})\n", 'hand')
    expect(state.leaves.text.radius).toBe('4px')
    expect(state.leaves.text.fill).toBe('dots')
    expect(ignored).toEqual(expect.arrayContaining(['scale', 'filter']))
  })

  it('refuses a file that runs code', () => {
    expect(() => sourceToState('export default defineTheme({ radius: compute() })', 'x')).toThrow('cannot read')
    expect(() => sourceToState('nothing here', 'x')).toThrow('no theme object')
  })

  it('shares the state in the url hash', () => {
    const state = normalizeState(states[4]![1])
    expect(decodeState(`#${encodeState(state)}`)).toEqual(state)
    expect(decodeState('#g=%%%')).toBeUndefined()
    expect(decodeState('#other')).toBeUndefined()
  })

  it('parses and prints literals', () => {
    const value = { a: 'it\'s', b: [1, true, null], 'c-d': { e: -1.5 } }
    expect(parseLiteral(toLiteral(value))).toEqual(value)
  })
})

describe('validation', () => {
  const valid = (): unknown => JSON.parse(JSON.stringify(emptyState()))

  it('accepts a generated state', () => {
    expect(sanitizeState(valid())).toEqual(normalizeState(emptyState()))
  })

  it.each([
    ['css break-out', (state: any) => (state.leaves.text.custom = 'red} body{display:none')],
    ['declaration injection', (state: any) => (state.leaves.media.clip = 'none; color: red')],
    ['bad name', (state: any) => (state.name = '../x')],
    ['bad border width', (state: any) => (state.leaves.text.border.width = 500)],
    ['bad border kind', (state: any) => (state.leaves.text.border.kind = 'wavy')],
    ['bad color', (state: any) => (state.colors.light.base = 'url(x)')],
    ['bad motion', (state: any) => (state.motions = ['spin'])],
    ['bad speed', (state: any) => (state.speed = 99)],
  ])('rejects %s', (_, change) => {
    const state = valid()
    change(state)
    expect(() => sanitizeState(state)).toThrow('charpente-studio')
  })

  it('keeps the list of built-in names in step with the library', () => {
    expect([...BUILTIN_NAMES].sort()).toEqual(Object.keys(builtinThemes).sort())
    expect(Object.keys(themesOf(themeExports)).sort()).toEqual([...BUILTIN_NAMES].sort())
  })
})

describe('preview', () => {
  const themes = themesOf(themeExports)

  it('compiles the chosen shape, fill and hover', () => {
    const css = previewCss(edit((draft) => {
      all(draft, (leaf) => Object.assign(leaf, { clip: SHAPES[9]?.clip, fill: 'custom', custom: 'linear-gradient(red, blue)', hover: 'accent', border: { kind: 'dashed', width: 2, color: 'strong' } }))
      draft.motions = ['glitch']
    }), themes, false)
    expect(css).toContain('clip-path: polygon(0 0, calc(100% - 14px) 0')
    expect(css).toContain('linear-gradient(red, blue)')
    expect(css).toContain('2px dashed var(--charpente-strong)')
    expect(css).toContain('charpente-glitch')
    expect(css).toContain(':hover')
  })

  it('previews the crt motion with its overlay and keeps it through the config', () => {
    const state = edit((draft) => (draft.motions = ['crt']))
    const css = previewCss(state, themes, false)
    expect(css).toContain('@keyframes charpente-crt-overlay')
    expect(css).toContain('::after')
    expect(configSource(state)).toContain("motion: 'crt'")
    expect(sanitizeState(JSON.parse(JSON.stringify(state))).motions).toEqual(['crt'])
  })

  it('compiles on top of every built-in theme', () => {
    for (const name of BUILTIN_NAMES) expect(() => previewCss(startState(name), themes, false)).not.toThrow()
  })

  it('forces animations only when asked', () => {
    expect(previewCss(emptyState(), themes, false)).toContain('prefers-reduced-motion: reduce')
    expect(previewCss(emptyState(), themes, true)).not.toContain('prefers-reduced-motion: reduce')
  })

  it('matches the core compiler for the generated theme', () => {
    const state = edit((draft) => all(draft, (leaf) => (leaf.fill = 'dots')))
    const { css } = compile({ themes: { 'gen-preview': stateToTheme(state) }, defaultTheme: 'gen-preview' })
    expect(css).toContain('radial-gradient(circle, var(--charpente-strong)')
  })
})
