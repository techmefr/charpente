import type { LoadingScope } from './attributes'

export type PaintType = 'text' | 'media' | 'control' | 'block'

export type Declarations = Record<string, string>

export type TokenName = 'base' | 'strong' | 'shine' | 'accent' | 'accent2'

export type Tokens = Partial<Record<TokenName, string>>

export interface Paint {
  fill?: string
  size?: string
  style?: Declarations
}

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
}

export interface MotionDef {
  duration: string
  easing?: string
  iterations?: string
  layer?: string
  keyframes: Record<string, Declarations>
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
  motions?: Record<string, MotionDef>
}

export interface CompileResult {
  css: string
  warnings: string[]
}
