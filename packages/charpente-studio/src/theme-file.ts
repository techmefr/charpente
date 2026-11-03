import type { ThemeDef } from 'charpente'

export const PATTERNS = ['solid', 'dots', 'stripes', 'grid'] as const
export const MOTIONS = ['shimmer', 'sweep', 'pulse', 'glitch', 'crt'] as const

export interface ThemeForm {
  name: string
  colors: [string, string]
  pattern: (typeof PATTERNS)[number]
  radius: number
  scale: number
}

const NAME = /^[a-z][a-z0-9-]{0,40}$/
const COLOR = /^#[0-9a-f]{6}$/i
const MAX_RADIUS = 999
const MIN_SCALE = 0.5
const MAX_SCALE = 3

const record = (input: unknown): Record<string, unknown> => {
  if (typeof input !== 'object' || input === null) throw new Error('charpente-studio: the theme must be an object')
  return input as Record<string, unknown>
}

const color = (value: unknown): string => {
  if (typeof value !== 'string' || !COLOR.test(value)) throw new Error(`charpente-studio: "${String(value)}" is not a #rrggbb color`)
  return value.toLowerCase()
}

const bounded = (value: unknown, label: string, min: number, max: number): number => {
  const number = value
  if (typeof number !== 'number' || !Number.isFinite(number) || number < min || number > max) throw new Error(`charpente-studio: ${label} must be between ${min} and ${max}`)
  return number
}

export const validateForm = (input: unknown): ThemeForm => {
  const form = record(input)
  const colors = form.colors
  if (typeof form.name !== 'string' || !NAME.test(form.name)) throw new Error('charpente-studio: the name must be lowercase letters, digits and dashes')
  if (!Array.isArray(colors) || colors.length !== 2) throw new Error('charpente-studio: two colors are required')
  const pattern = PATTERNS.find((name) => name === form.pattern)
  if (!pattern) throw new Error(`charpente-studio: unknown pattern "${String(form.pattern)}"`)
  return {
    name: form.name,
    colors: [color(colors[0]), color(colors[1])],
    pattern,
    radius: bounded(form.radius, 'the radius', 0, MAX_RADIUS),
    scale: bounded(form.scale, 'the scale', MIN_SCALE, MAX_SCALE),
  }
}

export const formToTheme = (form: ThemeForm): ThemeDef => ({
  colors: form.colors,
  pattern: form.pattern,
  radius: `${form.radius}px`,
  scale: form.scale,
})

export const themeSource = (form: ThemeForm): string =>
  [
    "import { defineTheme } from 'charpente'",
    '',
    'export default defineTheme({',
    `  colors: ['${form.colors[0]}', '${form.colors[1]}'],`,
    `  pattern: '${form.pattern}',`,
    `  radius: '${form.radius}px',`,
    `  scale: ${form.scale},`,
    '})',
    '',
  ].join('\n')
