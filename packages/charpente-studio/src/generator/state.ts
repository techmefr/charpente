import type { HoverMotion, PaintType, ShapeRole } from 'charpente/lite'
import { customRoles } from './shapes'

export const LEAVES: readonly PaintType[] = ['text', 'media', 'block', 'control']
export const TOKENS = ['base', 'strong', 'shine', 'accent', 'accent2'] as const
export const COLOR_KEYS = ['base', 'strong', 'accent', 'accent2'] as const
export const MOTION_NAMES = ['shimmer', 'sweep', 'pulse', 'glitch'] as const
export const BORDER_KINDS = ['inherit', 'none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'outline', 'inset', 'diagonal'] as const
export const HOVER_MOTIONS = ['inherit', 'none', 'pause', 'faster'] as const

export type BorderKind = (typeof BORDER_KINDS)[number]
export type MotionName = (typeof MOTION_NAMES)[number]
export type ColorKey = (typeof COLOR_KEYS)[number]

export interface BorderState {
  kind: BorderKind
  width: number
  color: string
}

export interface LeafState {
  radius: string
  clip: string
  border: BorderState
  fill: string
  custom: string
  size: string
  hover: string
  shape: string
  roles: ShapeRole[]
}

export interface GeneratorState {
  name: string
  extends: string
  leaves: Record<PaintType, LeafState>
  siteColors: boolean
  colors: { light: Record<ColorKey, string>; dark: Record<ColorKey, string> }
  hoverMotion: HoverMotion | 'inherit'
  motions: MotionName[]
  speed: number
  delay: number
  stagger: number
}

export const BORDER_COLORS = [...TOKENS]

const LIGHT = { base: '#e5e7eb', strong: '#c4c8d0', accent: '#0891b2', accent2: '#c026d3' }
const DARK = { base: '#2a2d34', strong: '#454a55', accent: '#22d3ee', accent2: '#e879f9' }

export const inheritLeaf = (): LeafState => ({
  radius: '',
  clip: '',
  border: { kind: 'inherit', width: 2, color: 'strong' },
  fill: '',
  custom: '',
  size: '',
  hover: '',
  shape: '',
  roles: [],
})

const perLeaf = (make: () => LeafState): Record<PaintType, LeafState> => ({
  text: make(),
  media: make(),
  block: make(),
  control: make(),
})

export const baseState = (): GeneratorState => ({
  name: 'my-theme',
  extends: '',
  leaves: perLeaf(inheritLeaf),
  siteColors: true,
  colors: { light: { ...LIGHT }, dark: { ...DARK } },
  hoverMotion: 'inherit',
  motions: ['shimmer'],
  speed: 1,
  delay: 120,
  stagger: 0,
})

export const emptyState = (): GeneratorState => ({
  ...baseState(),
  leaves: perLeaf(() => ({ ...inheritLeaf(), radius: '8px', fill: 'solid' })),
  hoverMotion: 'none',
})

export const startState = (extendsName: string, name = 'my-theme'): GeneratorState =>
  extendsName ? { ...baseState(), name, extends: extendsName } : { ...emptyState(), name }

export const cloneState = (state: GeneratorState): GeneratorState => structuredClone(state)

const TOKEN_VAR = /^var\(--charpente-(base|strong|shine|accent2?)\)$/

export const tokenOf = (value: string): string => TOKEN_VAR.exec(value.trim())?.[1] ?? value.trim()

export const normalizeState = (input: GeneratorState): GeneratorState => {
  const state = cloneState(input)
  if (!state.extends && state.hoverMotion === 'inherit') state.hoverMotion = 'none'
  for (const leaf of LEAVES) {
    const current = state.leaves[leaf]
    current.hover = tokenOf(current.hover)
    current.border.color = tokenOf(current.border.color)
    current.radius = current.radius.trim()
    current.clip = current.clip.trim()
    current.custom = current.custom.trim()
    current.size = current.size.trim()
    current.roles = current.shape && customRoles(current.shape, current.roles) ? current.roles : []
    if (!state.extends && current.clip === 'none') current.clip = ''
    if (current.fill === 'custom' && !current.custom) current.fill = ''
  }
  return state
}
