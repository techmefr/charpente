import type { Declarations } from './index'

export interface MotionOverlay {
  style: Declarations
  duration: string
  keyframes: Record<string, Declarations>
}

export type MotionTrace = 'border' | 'line'

export interface MotionDef {
  duration: string
  easing?: string
  iterations?: string
  layer?: string
  ambient?: boolean
  attachment?: string
  trace?: MotionTrace
  keyframes: Record<string, Declarations>
  container?: Record<string, Declarations>
  overlay?: MotionOverlay
}
