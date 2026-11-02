import { createElement, Suspense, type ReactNode } from "react"
import { Charpente, type CharpenteProps } from "./charpente"

export interface CharpenteSuspenseProps extends Omit<CharpenteProps, "loading" | "children"> {
  fallback?: ReactNode
  children?: ReactNode
}

export const CharpenteSuspense = ({ fallback, children, ...props }: CharpenteSuspenseProps) =>
  createElement(
    Suspense,
    { fallback: createElement(Charpente, { ...props, loading: true }, fallback) },
    createElement(Charpente, { ...props, loading: false }, children),
  )
