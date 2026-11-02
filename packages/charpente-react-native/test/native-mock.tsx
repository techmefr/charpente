import { createElement, type ReactNode } from "react"

type Style = Record<string, unknown> | Style[] | null | undefined | false

const flatten = (style: Style): Record<string, unknown> =>
  Array.isArray(style) ? Object.assign({}, ...style.map(flatten)) : ((style as Record<string, unknown>) || {})

const plain = (tag: string) => ({ style, children, ...props }: { style?: Style; children?: ReactNode; [key: string]: unknown }) => {
  const { accessibilityState, pointerEvents, ...rest } = props
  const flat = flatten(style)
  const opacity = flat.opacity as { value?: number } | number | undefined
  const resolved = { ...flat, ...(typeof opacity === "object" ? { opacity: opacity.value } : {}) }
  return createElement(
    tag,
    {
      ...Object.fromEntries(Object.entries(rest).filter(([, value]) => typeof value !== "function" && typeof value !== "object")),
      "data-style": JSON.stringify(resolved),
      "data-busy": accessibilityState ? String((accessibilityState as { busy: boolean }).busy) : undefined,
      "data-pointer": pointerEvents as string | undefined,
    },
    children,
  )
}

export const View = plain("div")
export const Text = plain("span")
export const Image = plain("img")
export const Pressable = plain("button")

export class Value {
  constructor(public value: number) {}
  setValue(next: number) {
    this.value = next
  }
}

const animation = { start: () => undefined, stop: () => undefined }
export const Animated = {
  View,
  Text,
  Value,
  timing: () => animation,
  sequence: () => animation,
  loop: () => animation,
}

export const useColorScheme = () => "light"

export const AccessibilityInfo = { isReduceMotionEnabled: () => Promise.resolve(false) }
