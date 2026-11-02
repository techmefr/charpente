import { createEffect, createSignal, onMount, type Accessor } from 'solid-js'
import { configuredScope } from 'charpente/dom'
import type { CharpenteProps } from './charpente-props'

export const createPageScope = (own: CharpenteProps, element: () => HTMLElement | undefined): Accessor<boolean> => {
  const [page, setPage] = createSignal(own.scope === 'page')

  onMount(() => {
    const target = element()
    if (own.scope === undefined && target) setPage(configuredScope(target) === 'page')
  })

  createEffect(() => {
    if (own.scope !== undefined) setPage(own.scope === 'page')
  })

  return page
}
