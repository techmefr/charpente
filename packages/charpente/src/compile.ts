import { builtinMotions } from './motions'
import { validateSchedule } from './schedule'
import { builtinThemes, flat } from './themes'
import type {
  CharpenteConfig,
  CompileResult,
  Declarations,
  MotionDef,
  Paint,
  PaintType,
  ThemeDef,
  Tokens,
} from './types'

const MEDIA = 'img, svg, video, canvas, picture, iframe'
const CONTROL = 'button, input, select, textarea'
const LOADING = '[data-charpente-loading]'
const OUTSIDE_BLOCK = ':not([data-charpente-block] *)'
const CONTROL_PARTS = ':not(:is(button, [role="button"], select, fieldset, legend, [role="combobox"]) *)'
const MAX_STAGGER_INDEX = 16
const MAX_COMBINED_MOTIONS = 6
const PAINT_TYPES: PaintType[] = ['text', 'media', 'control', 'block']

const TYPE_SELECTORS: Record<PaintType, string> = {
  text: `:not(:has(*)):not([data-charpente-block]):not(:is(${MEDIA}, ${CONTROL})):not(:is(${MEDIA}) *)${CONTROL_PARTS}${OUTSIDE_BLOCK}`,
  media: `:is(${MEDIA})${OUTSIDE_BLOCK}`,
  control: `:is(${CONTROL})${OUTSIDE_BLOCK}`,
  block: '[data-charpente-block]',
}

const DEFAULT_TOKENS: { light: Required<Tokens>; dark: Required<Tokens> } = {
  light: {
    base: '#e5e7eb',
    strong: '#c4c8d0',
    shine: 'rgba(255, 255, 255, 0.7)',
    accent: '#0891b2',
    accent2: '#c026d3',
  },
  dark: {
    base: '#2a2d34',
    strong: '#454a55',
    shine: 'rgba(255, 255, 255, 0.08)',
    accent: '#22d3ee',
    accent2: '#e879f9',
  },
}

interface ResolvedTheme {
  tokens: Tokens
  dark: Tokens
  paint: Partial<Record<PaintType, Paint>>
}

const kebab = (property: string): string =>
  property.startsWith('--') ? property : property.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

const declarations = (decls: Declarations = {}): string =>
  Object.entries(decls)
    .map(([property, value]) => `${kebab(property)}: ${value}`)
    .join('; ')

const splitTopLevel = (value: string): string[] => {
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const char of value) {
    if (char === '(') depth++
    if (char === ')') depth--
    if (char === ',' && depth === 0) {
      parts.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  parts.push(current.trim())
  return parts
}

const tokenDeclarations = (tokens: Tokens): string =>
  Object.entries(tokens)
    .map(([name, value]) => `--charpente-${name}: ${value}`)
    .join('; ')

const mergePaint = (
  base: Partial<Record<PaintType, Paint>>,
  extra: Partial<Record<PaintType, Paint>> = {},
): Partial<Record<PaintType, Paint>> => {
  const merged: Partial<Record<PaintType, Paint>> = { ...base }
  for (const type of PAINT_TYPES) {
    const override = extra[type]
    if (!override) continue
    merged[type] = {
      ...base[type],
      ...override,
      style: { ...base[type]?.style, ...override.style },
    }
  }
  return merged
}

const resolveTheme = (
  name: string,
  themes: Record<string, ThemeDef>,
  chain: string[] = [],
): ResolvedTheme => {
  const def = themes[name]
  if (!def) throw new Error(`charpente: unknown theme "${name}"`)
  if (chain.includes(name)) throw new Error(`charpente: theme "${name}" extends itself`)
  const parent = def.extends
    ? resolveTheme(def.extends, themes, [...chain, name])
    : { tokens: {}, dark: {}, paint: {} }
  return {
    tokens: { ...parent.tokens, ...def.tokens },
    dark: { ...parent.dark, ...def.dark },
    paint: mergePaint(parent.paint, def.paint),
  }
}

const normalizeMotion = (
  motion: string | string[],
  motions: Record<string, MotionDef>,
): string[] => {
  const names = (Array.isArray(motion) ? motion : [motion]).filter((name) => name !== 'none')
  for (const name of names) {
    if (!motions[name]) throw new Error(`charpente: unknown motion "${name}"`)
  }
  return [...new Set(names)].sort()
}

const within = (scopes: string[], selector: string): string =>
  scopes.map((scope) => `${scope} ${selector}`).join(',\n')

const allLeaves = (scope: string): string =>
  PAINT_TYPES.map((type) => `${scope} ${TYPE_SELECTORS[type]}`).join(',\n')

const subsets = (names: string[]): string[][] => {
  if (names.length > MAX_COMBINED_MOTIONS) return names.map((name) => [name])
  const result: string[][] = []
  for (let mask = 1; mask < 1 << names.length; mask++) {
    result.push(names.filter((_, index) => mask & (1 << index)))
  }
  return result
}

const darkThemeTokens = (
  scopes: string[],
  tokens: Tokens,
  scheme: CharpenteConfig['colorScheme'],
): string => {
  const body = tokenDeclarations(tokens)
  if (scheme?.dark) {
    const dark = scheme.dark
    return `${scopes.map((scope) => `${dark} ${scope}`).join(',\n')} {\n  ${body};\n}`
  }
  const guarded = scheme?.light ? scopes.map((scope) => `${scope}:not(${scheme.light} *)`) : scopes
  return `@media (prefers-color-scheme: dark) {\n  ${guarded.join(',\n  ')} {\n    ${body};\n  }\n}`
}

const themeCss = (
  name: string,
  isDefault: boolean,
  themes: Record<string, ThemeDef>,
  scheme: CharpenteConfig['colorScheme'],
): string => {
  const resolved = resolveTheme(name, themes)
  const scopes = [`${LOADING}[data-charpente-theme="${name}"]`]
  if (isDefault) scopes.push(`${LOADING}:not([data-charpente-theme])`)

  const blocks: string[] = []
  if (Object.keys(resolved.tokens).length > 0) {
    blocks.push(`${scopes.join(',\n')} {\n  ${tokenDeclarations(resolved.tokens)};\n}`)
  }
  if (Object.keys(resolved.dark).length > 0) {
    blocks.push(darkThemeTokens(scopes, resolved.dark, scheme))
  }

  for (const type of PAINT_TYPES) {
    const paint = resolved.paint[type] ?? {}
    const layers = splitTopLevel(paint.fill ?? flat('var(--charpente-base)'))
    const sizes = paint.size ? splitTopLevel(paint.size) : []
    const sizeList = layers.map((_, index) => sizes[index] ?? 'auto')
    const body = [
      'background-color: transparent !important',
      `background-image: var(--charpente-shine-layer, none), ${layers.join(', ')} !important`,
      `background-size: 60% 100%, ${sizeList.join(', ')} !important`,
      `background-repeat: no-repeat, ${layers.map(() => 'repeat').join(', ')} !important`,
      `background-position: var(--charpente-shine-x, -80%) 0, ${layers.map(() => '0 0').join(', ')} !important`,
      ...(type === 'text'
        ? ['background-clip: content-box !important', 'background-origin: content-box !important']
        : []),
      declarations(paint.style),
    ]
      .filter(Boolean)
      .join(';\n  ')
    blocks.push(`${within(scopes, TYPE_SELECTORS[type])} {\n  ${body};\n}`)
  }
  return blocks.join('\n')
}

const keyframesCss = (name: string, motion: MotionDef): string => {
  const steps = Object.entries(motion.keyframes)
    .map(([step, decls]) => `${step} { ${declarations(decls)} }`)
    .join(' ')
  return `@keyframes charpente-${name} { ${steps} }`
}

const motionCss = (
  motions: Record<string, MotionDef>,
  defaultNames: string[],
  delay: number,
  stagger: number,
  warnings: string[],
): string => {
  const delayVar = `var(--charpente-delay, ${delay}ms)`
  const staggerDelay = `calc(${delayVar} + var(--charpente-i, 0) * var(--charpente-stagger, ${stagger}ms))`
  const reveal = `charpente-reveal 0s linear ${staggerDelay} both`

  const rule = (scopes: string[], names: string[]): string => {
    const animations = [
      reveal,
      ...names.map((name) => {
        const motion = motions[name] as MotionDef
        const start = motion.staggered ? staggerDelay : delayVar
        return `charpente-${name} ${motion.duration} ${motion.easing ?? 'ease-in-out'} ${start} ${motion.iterations ?? 'infinite'}`
      }),
    ]
    const layer = names.map((name) => motions[name]?.layer).find(Boolean)
    const body = [`animation: ${animations.join(', ')}`]
    if (layer) body.push(`--charpente-shine-layer: ${layer}`)
    return `${scopes.map(allLeaves).join(',\n')} {\n  ${body.join(';\n  ')};\n}`
  }

  const allNames = Object.keys(motions).sort()
  const motionScopes = (names: string[]): string[] => {
    const exact = `${LOADING}[data-charpente-motion="${names.join(' ')}"]`
    if (allNames.length > MAX_COMBINED_MOTIONS) return [exact]
    const has = names.map((name) => `[data-charpente-motion~="${name}"]`)
    const lacks = allNames
      .filter((name) => !names.includes(name))
      .map((name) => `:not([data-charpente-motion~="${name}"])`)
    return [exact, `${LOADING}${has.join('')}${lacks.join('')}`]
  }

  const seen = new Map<string, string>()
  for (const name of defaultNames) {
    for (const decls of Object.values((motions[name] as MotionDef).keyframes)) {
      for (const property of Object.keys(decls)) {
        if (property.startsWith('--')) continue
        const owner = seen.get(property)
        if (owner && owner !== name) {
          warnings.push(
            `charpente: motions "${owner}" and "${name}" both animate "${property}", the later one wins`,
          )
        }
        seen.set(property, name)
      }
    }
  }

  const rules = [
    rule([`${LOADING}:not([data-charpente-motion])`], defaultNames),
    rule([`${LOADING}[data-charpente-motion="none"]`], []),
    ...subsets(allNames).map((names) => rule(motionScopes(names), names)),
  ]
  return rules.join('\n')
}

const baseCss = (): string => {
  const hidden = [
    'color: transparent',
    '-webkit-text-fill-color: transparent',
    'text-shadow: none',
    'box-shadow: none',
    'border-color: transparent',
    'caret-color: transparent',
    'user-select: none',
    'pointer-events: none',
  ].join(';\n  ')
  const staggerIndices = Array.from(
    { length: MAX_STAGGER_INDEX },
    (_, index) => `${LOADING} :nth-child(${index + 1}) { --charpente-i: ${index + 1}; }`,
  ).join('\n')
  return [
    `${LOADING} * {\n  -webkit-text-fill-color: transparent;\n  text-shadow: none;\n  text-decoration-color: transparent !important;\n}`,
    `${LOADING} :is(td, th) {\n  box-shadow: none !important;\n  border-color: transparent !important;\n}`,
    `${LOADING} :is(tr, thead, tbody, tfoot, table) {\n  border-color: transparent !important;\n  box-shadow: none !important;\n}`,
    `${LOADING} :is(button, [role="button"], input, select, textarea, fieldset) {\n  border-color: transparent !important;\n}`,
    `${allLeaves(LOADING)} {\n  ${hidden};\n}`,
    `${LOADING} [data-charpente-block] > *,\n${LOADING} svg * {\n  visibility: hidden;\n}`,
    `${LOADING} img {\n  content: url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");\n}`,
    `${LOADING} ::placeholder {\n  color: transparent;\n}`,
    staggerIndices,
  ].join('\n')
}

const tokensCss = (config: CharpenteConfig): string => {
  const light = { ...DEFAULT_TOKENS.light, ...config.colorScheme?.tokens?.light }
  const dark = { ...DEFAULT_TOKENS.dark, ...config.colorScheme?.tokens?.dark }
  const root = `:root {\n  --charpente-radius: 0.35em;\n  ${tokenDeclarations(light)};\n}`
  const darkSelector = config.colorScheme?.dark
  const lightSelector = config.colorScheme?.light
  const forcedLight = lightSelector ? `\n${lightSelector} {\n  ${tokenDeclarations(light)};\n}` : ''
  if (darkSelector) return `${root}\n${darkSelector} {\n  ${tokenDeclarations(dark)};\n}${forcedLight}`
  return `${root}\n@media (prefers-color-scheme: dark) {\n  :root {\n    ${tokenDeclarations(dark)};\n  }\n}${forcedLight}`
}

const selectThemes = (config: CharpenteConfig, themes: Record<string, ThemeDef>): string[] => {
  const all = Object.keys(themes)
  if (!config.include) return all
  for (const name of config.include) {
    if (!themes[name]) throw new Error(`charpente: include uses unknown theme "${name}"`)
  }
  const kept = new Set([
    ...config.include,
    config.defaultTheme ?? 'solid',
    ...(config.schedule ?? []).map((entry) => entry.theme),
    ...Object.keys(config.themes ?? {}),
  ])
  return all.filter((name) => kept.has(name))
}

const revealCss = (): string =>
  [
    `[data-charpente-ready] > * {\n  animation: charpente-reveal-in 260ms ease-out;\n}`,
    `@media (prefers-reduced-motion: reduce) {`,
    `  ${allLeaves(LOADING).replace(/\n/g, '\n  ')} {\n    animation: none !important;\n    --charpente-shine-layer: none !important;\n  }`,
    `  [data-charpente-ready] > * {\n    animation: none;\n  }`,
    `}`,
  ].join('\n')

export function compile(config: CharpenteConfig = {}): CompileResult {
  const warnings: string[] = []
  const themes = { ...builtinThemes, ...config.themes }
  const motions = { ...builtinMotions, ...config.motions }
  const defaultTheme = config.defaultTheme ?? 'solid'
  const defaultMotion = normalizeMotion(config.motion ?? 'shimmer', motions)
  const delay = config.timing?.delay ?? 120
  const stagger = config.timing?.stagger ?? 0

  resolveTheme(defaultTheme, themes)
  validateSchedule(config.schedule ?? [], Object.keys(themes), config.timeZone)

  const layered = [
    tokensCss(config),
    baseCss(),
    ...selectThemes(config, themes).map((name) =>
      themeCss(name, name === defaultTheme, themes, config.colorScheme),
    ),
    motionCss(motions, defaultMotion, delay, stagger, warnings),
    revealCss(),
  ].join('\n')

  const css = [
    `@property --charpente-shine-x { syntax: '<percentage>'; inherits: false; initial-value: -80%; }`,
    `@keyframes charpente-reveal { from { visibility: hidden; } to { visibility: visible; } }`,
    `@keyframes charpente-reveal-in { from { opacity: 0; } to { opacity: 1; } }`,
    ...Object.entries(motions).map(([name, motion]) => keyframesCss(name, motion)),
    `@layer charpente {\n${layered}\n}`,
  ].join('\n')

  return { css, warnings }
}
