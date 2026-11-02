import type { LoadingScope } from "charpente"
import type { Component, Snippet } from "svelte"
import type { HTMLAttributes } from "svelte/elements"

export interface CharpenteProps extends HTMLAttributes<HTMLElement> {
  loading?: boolean
  tag?: string
  theme?: string
  motion?: string | string[]
  delay?: number
  stagger?: number
  reveal?: number
  capture?: string
  scope?: LoadingScope
  label?: string
  revealMs?: number
  children?: Snippet
}

export const Charpente: Component<CharpenteProps>
