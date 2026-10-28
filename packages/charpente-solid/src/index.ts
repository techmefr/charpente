import {
  createComponent,
  createEffect,
  createSignal,
  mergeProps,
  on,
  onCleanup,
  splitProps,
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

  createEffect(
    on(
      () => own.loading ?? false,
      (now, before) => {
        if (!before || now) return
        setReady(true)
        const timer = setTimeout(() => setReady(false), own.revealMs ?? 260)
        onCleanup(() => clearTimeout(timer))
      },
      { defer: true },
    ),
  )

  const attributes = () =>
    loadingAttributes({
      loading: own.loading ?? false,
      theme: own.theme,
      motion: own.motion,
      delay: own.delay,
      stagger: own.stagger,
    })

  const style = () => {
    const base = typeof own.style === 'object' && own.style !== null ? own.style : {}
    return { ...base, ...attributes().style }
  }

  const root = createComponent(
    Dynamic,
    mergeProps(rest, () => attributes().attributes, {
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
    own.loading && own.label
      ? createComponent(Dynamic, {
          component: 'span',
          role: 'status',
          style: SCREEN_READER_ONLY,
          children: own.label,
        })
      : undefined

  return [root, status] as unknown as JSX.Element
}
