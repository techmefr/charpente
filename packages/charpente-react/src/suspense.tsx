import { createElement, Suspense, useLayoutEffect, useState, type ReactNode } from "react"
import { Charpente, type CharpenteProps } from "./charpente"

export interface CharpenteSuspenseProps extends Omit<CharpenteProps, "loading" | "children"> {
  fallback?: ReactNode
  children?: ReactNode
}

const PendingMarker = ({ onPending, children }: { onPending: (pending: boolean) => void; children?: ReactNode }) => {
  useLayoutEffect(() => {
    onPending(true)
    return () => onPending(false)
  }, [onPending])
  return children
}

export const CharpenteSuspense = ({ fallback, children, ...props }: CharpenteSuspenseProps) => {
  const [pending, setPending] = useState(false)
  return createElement(
    Charpente,
    { ...props, loading: pending },
    createElement(
      Suspense,
      { fallback: createElement(PendingMarker, { onPending: setPending }, fallback) },
      children,
    ),
  )
}
