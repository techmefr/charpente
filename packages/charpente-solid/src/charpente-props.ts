import type { JSX } from 'solid-js'
import type { LoadingScope } from 'charpente'

export interface CharpenteProps extends JSX.HTMLAttributes<HTMLElement> {
  loading?: boolean
  tag?: string
  theme?: string
  motion?: string | string[]
  delay?: number
  stagger?: number
  reveal?: number
  scope?: LoadingScope
  label?: string
  revealMs?: number
}
