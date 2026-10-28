import { loadingAttributes, type LoadingOptions } from './attributes'

const MANAGED_ATTRIBUTES = [
  'data-charpente-loading',
  'data-charpente-theme',
  'data-charpente-motion',
  'aria-busy',
  'inert',
]
const MANAGED_PROPERTIES = ['--charpente-delay', '--charpente-stagger']

export const setLoading = (element: HTMLElement, options: LoadingOptions): void => {
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
