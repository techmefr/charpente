import { loadingAttributes, type LoadingOptions, type LoadingScope } from './attributes'

const MANAGED_ATTRIBUTES = [
  'data-charpente-loading',
  'data-charpente-theme',
  'data-charpente-motion',
  'data-charpente-reveal',
  'data-charpente-ready',
  'aria-busy',
  'inert',
]
const MANAGED_PROPERTIES = ['--charpente-delay', '--charpente-stagger', '--charpente-reveal']

const clear = (element: HTMLElement): void => {
  for (const name of MANAGED_ATTRIBUTES) element.removeAttribute(name)
  for (const name of MANAGED_PROPERTIES) element.style.removeProperty(name)
}

export const configuredScope = (element?: Element): LoadingScope => {
  const view = element?.ownerDocument?.defaultView ?? (typeof window === 'undefined' ? undefined : window)
  if (!view) return 'element'
  const value = view.getComputedStyle(view.document.documentElement).getPropertyValue('--charpente-scope')
  return value.trim() === 'page' ? 'page' : 'element'
}

export const setLoading = (element: HTMLElement, options: LoadingOptions): void => {
  const scope = options.scope ?? configuredScope(element)
  const target = scope === 'page' ? element.ownerDocument.documentElement : element
  if (target !== element) clear(element)
  apply(target, options)
}

const apply = (element: HTMLElement, options: LoadingOptions): void => {
  const { attributes, style } = loadingAttributes(options)
  for (const name of MANAGED_ATTRIBUTES) {
    const value = attributes[name]
    if (value === undefined) element.removeAttribute(name)
    else element.setAttribute(name, value)
  }
  for (const name of MANAGED_PROPERTIES) {
    const value = style[name]
    if (value === undefined) element.style.removeProperty(name)
    else element.style.setProperty(name, value)
  }
}
