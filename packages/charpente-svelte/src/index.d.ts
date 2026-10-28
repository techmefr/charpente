import type { Component, Snippet } from "svelte"
import type { HTMLAttributes } from "svelte/elements"

export interface CharpenteProps extends HTMLAttributes<HTMLElement> {
  loading?: boolean
  tag?: string
  theme?: string
  motion?: string | string[]
  delay?: number
  stagger?: number
  label?: string
  revealMs?: number
  children?: Snippet
}

export const Charpente: Component<CharpenteProps>
