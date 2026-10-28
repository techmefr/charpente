export type PaintType = 'text' | 'media' | 'control' | 'block'

export type Declarations = Record<string, string>

export type TokenName = 'base' | 'strong' | 'shine' | 'accent' | 'accent2'

export type Tokens = Partial<Record<TokenName, string>>

export interface Paint {
  fill?: string
  size?: string
  style?: Declarations
}

export interface ThemeDef {
  extends?: string
  tokens?: Tokens
  paint?: Partial<Record<PaintType, Paint>>
}

export interface MotionDef {
  duration: string
  easing?: string
  iterations?: string
  staggered?: boolean
  layer?: string
  keyframes: Record<string, Declarations>
}

export interface Timing {
  delay?: number
  stagger?: number
}

export interface ColorScheme {
  dark?: string
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
  timeZone?: string
  schedule?: ScheduleEntry[]
  motion?: string | string[]
  timing?: Timing
  colorScheme?: ColorScheme
  themes?: Record<string, ThemeDef>
  motions?: Record<string, MotionDef>
}

export interface CompileResult {
  css: string
  warnings: string[]
}
