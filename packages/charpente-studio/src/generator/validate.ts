import {
  BORDER_KINDS,
  COLOR_KEYS,
  HOVER_MOTIONS,
  LEAVES,
  MOTION_NAMES,
  baseState,
  normalizeState,
  type BorderKind,
  type GeneratorState,
  type LeafState,
  type MotionName,
} from './state'
import { ROLES, SHAPE_LIBRARY } from './shapes'

export const NAME = /^[a-z][a-z0-9-]{0,40}$/
const MAX_CSS = 4000
const FORBIDDEN = /[{}<>\\@]/
const COLOR = /^(#[0-9a-f]{3,8}|[a-z]+|(rgb|hsl|oklch|oklab|color-mix)a?\([^;{}]*\))$/i

const fail = (message: string): never => {
  throw new Error(`charpente-studio: ${message}`)
}

export const isSafeCss = (value: string): boolean => {
  if (value.length > MAX_CSS || FORBIDDEN.test(value)) return false
  let depth = 0
  for (const char of value) {
    if (char === '(') depth++
    if (char === ')') depth--
    if (depth < 0 || (char === ';' && depth === 0)) return false
  }
  return depth === 0
}

export const isColor = (value: string): boolean => COLOR.test(value) && isSafeCss(value)

const record = (input: unknown, label: string): Record<string, unknown> => {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return fail(`${label} must be an object`)
  return input as Record<string, unknown>
}

const css = (value: unknown, label: string): string => {
  if (typeof value !== 'string') return fail(`${label} must be a string`)
  if (!isSafeCss(value)) return fail(`${label} contains characters that are not allowed in a CSS value`)
  return value
}

const choice = <T extends string>(value: unknown, allowed: readonly T[], label: string): T => {
  const found = allowed.find((name) => name === value)
  return found ?? fail(`unknown ${label} "${String(value)}"`)
}

const bounded = (value: unknown, label: string, min: number, max: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) return fail(`${label} must be between ${min} and ${max}`)
  return value
}

const shapeOf = (data: Record<string, unknown>): Pick<LeafState, 'shape' | 'roles'> => {
  const shape = data.shape === undefined ? '' : data.shape
  if (shape === '') return { shape: '', roles: [] }
  if (typeof shape !== 'string' || !SHAPE_LIBRARY[shape]) return fail(`unknown shape "${String(shape)}"`)
  const roles = data.roles === undefined ? [] : data.roles
  const layers = SHAPE_LIBRARY[shape]?.layers.length ?? 0
  if (!Array.isArray(roles) || (roles.length !== 0 && roles.length !== layers)) return fail('the layer roles do not match the shape')
  return { shape, roles: roles.map((role) => choice(role, ROLES, 'layer role')) }
}

const leaf = (input: unknown): LeafState => {
  const data = record(input, 'a leaf')
  const border = record(data.border, 'a border')
  const color = css(border.color, 'the border color')
  if (color !== '' && !isColor(color) && !/^(base|strong|shine|accent2?)$/.test(color)) fail(`"${color}" is not a color`)
  return {
    radius: css(data.radius, 'the radius'),
    clip: css(data.clip, 'the clip-path'),
    border: { kind: choice<BorderKind>(border.kind, BORDER_KINDS, 'border'), width: bounded(border.width, 'the border width', 0, 40), color },
    fill: css(data.fill, 'the fill'),
    custom: css(data.custom, 'the pasted fill'),
    size: css(data.size, 'the fill size'),
    hover: css(data.hover, 'the hover fill'),
    ...shapeOf(data),
  }
}

const palette = (input: unknown): Record<(typeof COLOR_KEYS)[number], string> => {
  const data = record(input, 'the colors')
  const entries = COLOR_KEYS.map((key) => {
    const value = css(data[key], `the ${key} color`)
    return [key, isColor(value) ? value : fail(`"${value}" is not a color`)] as const
  })
  return Object.fromEntries(entries) as Record<(typeof COLOR_KEYS)[number], string>
}

export const sanitizeState = (input: unknown): GeneratorState => {
  const data = record(input, 'the generator state')
  const name = data.name
  if (typeof name !== 'string' || !NAME.test(name)) fail('the name must be lowercase letters, digits and dashes')
  const leaves = record(data.leaves, 'the leaves')
  const colors = record(data.colors, 'the colors')
  if (!Array.isArray(data.motions)) fail('the motions must be a list')
  const state: GeneratorState = {
    ...baseState(),
    name: name as string,
    extends: css(data.extends, 'the starting theme'),
    leaves: Object.fromEntries(LEAVES.map((type) => [type, leaf(leaves[type])])) as GeneratorState['leaves'],
    siteColors: data.siteColors === true,
    colors: { light: palette(colors.light), dark: palette(colors.dark) },
    hoverMotion: choice(data.hoverMotion, HOVER_MOTIONS, 'hover motion'),
    motions: [...new Set((data.motions as unknown[]).map((motion) => choice<MotionName>(motion, MOTION_NAMES, 'motion')))],
    speed: bounded(data.speed, 'the speed', 0.1, 5),
    beamSize: data.beamSize === undefined ? 70 : bounded(data.beamSize, 'the beam size', 10, 360),
    beamWidth: data.beamWidth === undefined ? 2 : bounded(data.beamWidth, 'the beam width', 1, 12),
    delay: bounded(data.delay, 'the delay', 0, 5000),
    stagger: bounded(data.stagger, 'the stagger', 0, 2000),
  }
  if (!/^[a-z0-9-]*$/.test(state.extends)) fail('the starting theme name is invalid')
  return normalizeState(state)
}
