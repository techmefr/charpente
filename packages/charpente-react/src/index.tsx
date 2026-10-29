import { loadingAttributes } from "charpente"
import {
  createElement,
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react"

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
  as?: ElementType
  theme?: string
  motion?: string | string[]
  delay?: number
  stagger?: number
  label?: string
  revealMs?: number
  style?: CSSProperties
  children?: ReactNode
  [attribute: string]: unknown
}

export const useReveal = (loading: boolean, revealMs: number): boolean => {
  const [ready, setReady] = useState(false)
  const previous = useRef(loading)

  useEffect(() => {
    const wasLoading = previous.current
    previous.current = loading
    if (loading) {
      setReady(false)
      return
    }
    if (!wasLoading) return
    setReady(true)
    const timer = setTimeout(() => setReady(false), revealMs)
    return () => clearTimeout(timer)
  }, [loading, revealMs])

  return ready
}

export const Charpente = ({
  loading = false,
  as = "div",
  theme,
  motion,
  delay,
  stagger,
  label = "",
  revealMs = 260,
  style,
  children,
  ...rest
}: CharpenteProps) => {
  const ready = useReveal(loading, revealMs)
  const { attributes, style: variables } = loadingAttributes({ loading, theme, motion, delay, stagger })
  const { inert, ...domAttributes } = attributes
  const hasVariables = Object.keys(variables).length > 0

  const root = createElement(
    as,
    {
      ...rest,
      ...domAttributes,
      ...(inert === undefined ? {} : { inert: true }),
      ...(ready ? { "data-charpente-ready": "" } : {}),
      style: style || hasVariables ? { ...style, ...variables } : undefined,
    },
    children,
  )

  if (!label) return root
  return createElement(
    Fragment,
    null,
    root,
    createElement("span", { role: "status", style: SCREEN_READER_ONLY }, loading ? label : ""),
  )
}
