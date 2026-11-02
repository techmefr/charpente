import { createEffect, onCleanup, type Accessor } from 'solid-js'
import { setLoading } from 'charpente/dom'
import type { CharpenteProps } from './charpente-props'

export const applyPageLoading = (
  own: CharpenteProps,
  element: () => HTMLElement | undefined,
  page: Accessor<boolean>,
  ready: Accessor<boolean>,
): void => {
  createEffect(() => {
    const target = element()
    if (!page() || !target) return
    setLoading(target, {
      loading: own.loading ?? false,
      theme: own.theme,
      motion: own.motion,
      delay: own.delay,
      stagger: own.stagger,
      reveal: own.reveal,
      ready: ready(),
      scope: 'page',
    })
    onCleanup(() => setLoading(target, { loading: false, scope: 'page' }))
  })
}
