import type { ShapeDef } from './shape'
import type { MotionDef } from './motion'

export type * from './shape'
export type * from './motion'

export type LoadingScope = 'element' | 'page'

export type PaintType = 'text' | 'media' | 'control' | 'block'

export const PAINT_TYPES: PaintType[] = ['text', 'media', 'control', 'block']

export type Declarations = Record<string, string>

export type TokenName = 'base' | 'strong' | 'shine' | 'accent' | 'accent2'

export type Tokens = Partial<Record<TokenName, string>>

export interface Paint {
  fill?: string
  size?: string
  position?: string
  repeat?: string
  shape?: string | ShapeDef
  style?: Declarations
}

export type HoverMotion = 'pause' | 'faster' | 'none'

export interface HoverPaint extends Paint {
  border?: string | BorderImage
  radius?: string
}

export type HoverDef = string | Partial<Record<PaintType, HoverPaint>>

export type Stepped<T> = T | ((step: number) => T)

export interface PatternDef {
  fill: Stepped<string>
  size?: Stepped<string>
}

export interface BorderImage {
  image: string
  slice?: number
  width?: string
  repeat?: 'stretch' | 'repeat' | 'round' | 'space'
}

export interface ThemeDef {
  backdrop?: string
  extends?: string
  colors?: [base: string, strong: string]
  pattern?: string | PatternDef
  radius?: Stepped<string>
  border?: string | BorderImage
  variants?: Record<string, ThemeDef>
  scale?: number
  style?: Record<string, Stepped<string>>
  tokens?: Tokens
  dark?: Tokens
  paint?: Partial<Record<PaintType, Paint>>
  hover?: HoverDef
  hoverMotion?: HoverMotion
  motion?: string | string[]
}

export interface Timing {
  delay?: number
  stagger?: number
}

export interface ColorScheme {
  dark?: string
  light?: string
  tokens?: {
    light?: Tokens
    dark?: Tokens
  }
}

export interface ScheduleEntry {
  theme: string
  from: string
  to: string
}

export interface Bone {
  x: number
  y: number
  width: number
  height: number
  radius: number
  kind?: PaintType
}

export interface ZoneBones {
  width: number
  height: number
  bones: Bone[]
}

export type BonesData = Record<string, Record<string, ZoneBones>>

export interface CaptureConfig {
  routes?: string[]
  limit?: number
  breakpoints?: number[]
  wait?: number
  out?: string
  url?: string
  cdp?: string
  dev?: boolean
}

export interface CharpenteConfig {
  defaultTheme?: string
  include?: string[]
  timeZone?: string
  schedule?: ScheduleEntry[]
  motion?: string | string[]
  timing?: Timing
  reveal?: number
  scope?: LoadingScope
  colorScheme?: ColorScheme
  themes?: Record<string, ThemeDef>
  themesDir?: string
  shapes?: Record<string, ShapeDef>
  motions?: Record<string, MotionDef>
  capture?: CaptureConfig
  bones?: BonesData
  initial?: boolean | number
}

export interface CompileResult {
  css: string
  warnings: string[]
}
