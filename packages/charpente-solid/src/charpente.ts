import { createComponent, mergeProps, splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { loadingAttributes } from 'charpente'
import { applyPageLoading } from './apply-page-loading'
import { booleanInert } from './boolean-inert'
import type { CharpenteProps } from './charpente-props'
import { createPageScope } from './create-page-scope'
import { createRevealReady } from './create-reveal-ready'
import { screenReaderStatus } from './screen-reader-status'

export const Charpente = (props: CharpenteProps): JSX.Element => {
  const [own, rest] = splitProps(props, [
    'loading',
    'tag',
    'theme',
    'motion',
    'delay',
    'stagger',
    'reveal',
    'scope',
    'label',
    'revealMs',
    'children',
    'style',
  ])
  const ready = createRevealReady(own)

  let element: HTMLElement | undefined
  const currentElement = () => element
  const page = createPageScope(own, currentElement)
  applyPageLoading(own, currentElement, page, ready)

  const attributes = () =>
    loadingAttributes(
      page()
        ? { loading: false }
        : {
            loading: own.loading ?? false,
            theme: own.theme,
            motion: own.motion,
            delay: own.delay,
            stagger: own.stagger,
            reveal: own.reveal,
          },
    )

  const style = () => {
    const base = typeof own.style === 'object' && own.style !== null ? own.style : {}
    return { ...base, ...attributes().style }
  }

  const root = createComponent(
    Dynamic,
    mergeProps(rest, () => booleanInert(attributes().attributes), {
      get component() {
        return own.tag ?? 'div'
      },
      ref: (target: HTMLElement) => {
        element = target
      },
      get 'data-charpente-ready'() {
        return ready() && !page() ? '' : undefined
      },
      get style() {
        return style()
      },
      get children() {
        return own.children
      },
    }),
  )

  return [root, () => screenReaderStatus(own)] as unknown as JSX.Element
}
