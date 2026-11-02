import { createRawSnippet, flushSync, mount, unmount } from 'svelte'
import { afterEach, beforeEach, vi } from 'vitest'
import Charpente from '../src/Charpente.svelte'

let host: HTMLElement
let instance: Record<string, unknown> | undefined

const content = createRawSnippet(() => ({ render: () => '<b>x</b>' }))

export const getHost = (): HTMLElement => host

export const isInert = (element: HTMLElement) => {
  const flag = (element as HTMLElement & { inert?: unknown }).inert
  return flag === true || (element.hasAttribute('inert') && element.getAttribute('inert') !== 'false')
}

export const mountWithProps = (props: Record<string, unknown>) => {
  instance = mount(Charpente, { target: host, props })
  flushSync()
  return host.firstElementChild as HTMLElement
}

export const render = (props: Record<string, unknown> = {}) => mountWithProps({ children: content, ...props })

export const withContent = (props: Record<string, unknown>) => ({ children: content, ...props })

export const unmountInstance = (): void => {
  if (instance) unmount(instance)
  flushSync()
  instance = undefined
}

export const useMountLifecycle = (): void => {
  beforeEach(() => {
    host = document.createElement('div')
    document.body.appendChild(host)
  })

  afterEach(() => {
    if (instance) unmount(instance)
    instance = undefined
    host.remove()
    vi.useRealTimers()
  })
}
