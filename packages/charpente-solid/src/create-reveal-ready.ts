import { createEffect, createSignal, onCleanup, untrack, type Accessor } from 'solid-js'
import { revealWindow } from 'charpente'
import type { CharpenteProps } from './charpente-props'

export const createRevealReady = (own: CharpenteProps): Accessor<boolean> => {
  const [ready, setReady] = createSignal(false)

  let wasLoading = own.loading ?? false
  createEffect(() => {
    const now = own.loading ?? false
    const before = wasLoading
    wasLoading = now
    if (!before || now) return
    setReady(true)
    const timer = setTimeout(() => setReady(false), untrack(() => revealWindow(own.revealMs ?? 260, own.reveal)))
    onCleanup(() => clearTimeout(timer))
  })

  return ready
}
