import { createComponent } from 'solid-js'
import { render } from 'solid-js/web'
import { afterEach, beforeEach, vi } from 'vitest'
import { Charpente, type CharpenteProps } from '../src'

let host: HTMLElement
let dispose: () => void

export const getHost = (): HTMLElement => host

export const disposeMount = (): void => dispose()

export const isInert = (element: HTMLElement) =>
  (element as HTMLElement & { inert?: unknown }).inert === true || element.hasAttribute('inert')

export const mount = (props: CharpenteProps) => {
  dispose = render(() => createComponent(Charpente, props), host)
  return host.firstElementChild as HTMLElement
}

export const useMountLifecycle = (): void => {
  beforeEach(() => {
    host = document.createElement('div')
    document.body.appendChild(host)
  })

  afterEach(() => {
    dispose?.()
    host.remove()
    vi.useRealTimers()
  })
}
