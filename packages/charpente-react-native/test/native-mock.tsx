import { createElement, type ReactNode } from 'react'
import { vi } from 'vitest'

type Style = Record<string, unknown> | Style[] | null | undefined | false

interface MockProps {
  style?: Style
  children?: ReactNode
  testID?: string
  accessibilityState?: { busy?: boolean }
  accessibilityElementsHidden?: boolean
  importantForAccessibility?: string
  accessibilityLabel?: string
  role?: string
  pointerEvents?: string
  onLayout?: unknown
}

const flatten = (style: Style): Record<string, unknown> =>
  Array.isArray(style) ? Object.assign({}, ...style.map(flatten)) : ((style as Record<string, unknown>) || {})

const asText = (value: unknown): string | undefined => (value === undefined ? undefined : String(value))

const plain = (tag: string) => ({ style, children, ...props }: MockProps) => {
  const flat = flatten(style)
  const opacity = flat.opacity as { value?: number } | number | undefined
  const resolved = { ...flat, ...(typeof opacity === 'object' ? { opacity: opacity.value } : {}) }
  return createElement(
    tag,
    {
      'data-style': JSON.stringify(resolved),
      'data-test-id': props.testID,
      'data-busy': asText(props.accessibilityState?.busy),
      'data-pointer': props.pointerEvents,
      'data-a11y-hidden': asText(props.accessibilityElementsHidden),
      'data-important': props.importantForAccessibility,
      'data-label': props.accessibilityLabel,
      'data-role': props.role,
      'data-layout': props.onLayout ? 'true' : undefined,
    },
    children,
  )
}

export const View = plain('div')
export const Text = plain('span')
export const Image = plain('img')
export const Pressable = plain('button')

export class Value {
  constructor(public value: number) {
    native.values.push(this)
  }
  setValue(next: number) {
    this.value = next
  }
}

export const native = {
  scheme: 'light',
  reduceMotion: false,
  values: [] as Value[],
  listeners: [] as ((value: boolean) => void)[],
  removeListener: vi.fn(),
  loopStart: vi.fn(),
  loopStop: vi.fn(),
  loop: vi.fn(),
  reset() {
    this.scheme = 'light'
    this.reduceMotion = false
    this.values = []
    this.listeners = []
    this.removeListener = vi.fn()
    this.loopStart = vi.fn(() => this.values.forEach((value) => value.setValue(0.5)))
    this.loopStop = vi.fn()
    this.loop = vi.fn(() => ({ start: this.loopStart, stop: this.loopStop }))
  },
}

const step = { start: () => undefined, stop: () => undefined }
export const Animated = {
  View,
  Text,
  Value,
  timing: () => step,
  sequence: () => step,
  loop: (...args: unknown[]) => native.loop(...args),
}

export const StyleSheet = { flatten }

export const useColorScheme = () => native.scheme

export const AccessibilityInfo = {
  isReduceMotionEnabled: () => Promise.resolve(native.reduceMotion),
  addEventListener: (_name: string, listener: (value: boolean) => void) => {
    native.listeners.push(listener)
    return { remove: () => native.removeListener() }
  },
}
