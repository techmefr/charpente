import {
  createComponent,
  createEffect,
  createSignal,
  mergeProps,
  onCleanup,
  splitProps,
  untrack,
  type JSX,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { loadingAttributes, motionAttribute } from 'charpente'

export { motionAttribute }

export interface CharpenteProps extends JSX.HTMLAttributes<HTMLElement> {
  loading?: boolean
  tag?: string
  theme?: string
  motion?: string | string[]
  delay?: number
  stagger?: number
  label?: string
  revealMs?: number
}

const SCREEN_READER_ONLY = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  'white-space': 'nowrap',
} as const

const booleanInert = (attributes: Record<string, string>): Record<string, string | boolean> => {
  const { inert, ...others } = attributes
  return inert === undefined ? others : { ...others, inert: true }
}

const parseStyle = (value: string): Record<string, string> =>
  Object.fromEntries(
    value
      .split(';')
      .map((declaration) => declaration.split(/:(.*)/s))
      .filter(([name, content]) => name?.trim() && content?.trim())
      .map(([name, content]) => [name!.trim(), content!.trim()]),
  )

export const Charpente = (props: CharpenteProps): JSX.Element => {
  const [own, rest] = splitProps(props, [
    'loading',
    'tag',
    'theme',
    'motion',
    'delay',
    'stagger',
    'label',
    'revealMs',
    'children',
    'style',
  ])
  const [ready, setReady] = createSignal(false)

  let wasLoading = own.loading ?? false
  createEffect(() => {
    const now = own.loading ?? false
    const before = wasLoading
    wasLoading = now
    if (now) {
      setReady(false)
      return
    }
    if (!before) return
    setReady(true)
    const timer = setTimeout(() => setReady(false), untrack(() => own.revealMs ?? 260))
    onCleanup(() => clearTimeout(timer))
  })

  const attributes = () =>
    loadingAttributes({
      loading: own.loading ?? false,
      theme: own.theme,
      motion: own.motion,
      delay: own.delay,
      stagger: own.stagger,
    })

  const style = () => {
    const base = typeof own.style === 'string' ? parseStyle(own.style) : (own.style ?? {})
    return { ...base, ...attributes().style }
  }

  const root = createComponent(
    Dynamic,
    mergeProps(rest, () => booleanInert(attributes().attributes), {
      get component() {
        return own.tag ?? 'div'
      },
      get 'data-charpente-ready'() {
        return ready() ? '' : undefined
      },
      get style() {
        return style()
      },
      get children() {
        return own.children
      },
    }),
  )

  const status = () =>
    own.label
      ? createComponent(Dynamic, {
          component: 'span',
          role: 'status',
          style: SCREEN_READER_ONLY,
          children: own.loading ? own.label : '',
        })
      : undefined

  return [root, status] as unknown as JSX.Element
}
