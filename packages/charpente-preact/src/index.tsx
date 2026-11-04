import { loadingAttributes, motionAttribute, revealWindow, type LoadingScope } from "charpente"
import { configuredScope, setLoading } from "charpente/dom"
import { Fragment, h, type ComponentChildren, type ComponentType, type CSSProperties } from "preact"
import { useEffect, useRef, useState } from "preact/hooks"

const SCREEN_READER_ONLY: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
}

export interface CharpenteProps {
  loading?: boolean
  as?: string | ComponentType<Record<string, unknown>>
  theme?: string
  motion?: string | string[]
  delay?: number
  stagger?: number
  label?: string
  reveal?: number
  capture?: string
  revealMs?: number
  scope?: LoadingScope
  style?: CSSProperties
  children?: ComponentChildren
  [attribute: string]: unknown
}

export const useReveal = (loading: boolean, revealMs: number, reveal?: number): boolean => {
  const [ready, setReady] = useState(false)
  const previous = useRef(loading)

  useEffect(() => {
    const wasLoading = previous.current
    previous.current = loading
    if (!wasLoading || loading) return
    setReady(true)
    const timer = setTimeout(() => setReady(false), revealWindow(revealMs, reveal))
    return () => clearTimeout(timer)
  }, [loading, revealMs, reveal])

  return ready
}

const usePageScope = (scope: LoadingScope | undefined, element: { current: HTMLElement | null }): boolean => {
  const [page, setPage] = useState(scope === "page")

  useEffect(() => {
    if (scope !== undefined) setPage(scope === "page")
    else if (element.current) setPage(configuredScope(element.current) === "page")
  }, [scope, element])

  return page
}

export const Charpente = ({
  loading = false,
  as = "div",
  theme,
  motion,
  delay,
  stagger,
  reveal,
  capture,
  scope,
  label = "",
  revealMs = 260,
  style,
  children,
  ...rest
}: CharpenteProps) => {
  const element = useRef<HTMLElement | null>(null)
  const ready = useReveal(loading, revealMs, reveal)
  const page = usePageScope(scope, element)
  const motionNames = motionAttribute(motion)

  useEffect(() => {
    const target = element.current
    if (!page || !target) return
    setLoading(target, {
      loading,
      theme,
      motion: motionNames?.split(" "),
      delay,
      stagger,
      reveal,
      ready,
      scope: "page",
    })
    return () => setLoading(target, { loading: false, scope: "page" })
  }, [page, loading, theme, motionNames, delay, stagger, reveal, ready])

  const { attributes, style: variables } = loadingAttributes(
    page ? { loading: false, capture } : { loading, theme, motion, delay, stagger, reveal, capture },
  )
  const { inert, ...domAttributes } = attributes
  const hasVariables = Object.keys(variables).length > 0

  const root = h(
    as as string,
    {
      ...rest,
      ...domAttributes,
      ...(inert === undefined ? {} : { inert: true }),
      ...(ready && !page ? { "data-charpente-ready": "" } : {}),
      ref: element,
      style: style || hasVariables ? { ...style, ...variables } : undefined,
    },
    children,
  )

  if (!loading || !label) return root
  return h(Fragment, null, root, h("span", { role: "status", style: SCREEN_READER_ONLY }, label))
}
