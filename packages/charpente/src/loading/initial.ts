export const DEFAULT_INITIAL_GRACE = 3000

const RELEASED = ['data-charpente-initial', 'data-charpente-loading', 'aria-busy']

export const initialGrace = (initial: boolean | number | undefined): number | undefined => {
  if (initial === undefined || initial === false) return undefined
  return initial === true ? DEFAULT_INITIAL_GRACE : initial
}

export const initialAttributes = (): string => 'data-charpente-initial data-charpente-loading aria-busy="true"'

export const initialScript = (grace: number): string =>
  `(function(){var d=document.documentElement;addEventListener('load',function(){setTimeout(function(){if(d.hasAttribute('data-charpente-initial')){${RELEASED.map((name) => `d.removeAttribute('${name}');`).join('')}}},${grace})})})()`

export const transformInitial = (html: string, initial: boolean | number | undefined) => {
  const grace = initialGrace(initial)
  if (grace === undefined) return html
  return {
    html: withInitialLoading(html),
    tags: [{ tag: 'script', children: initialScript(grace), injectTo: 'head-prepend' as const }],
  }
}

export const withInitialLoading = (html: string): string => {
  const start = html.toLowerCase().indexOf('<html')
  const end = start === -1 ? -1 : html.indexOf('>', start)
  if (end === -1) return html
  const open = html.slice(start, end).trimEnd()
  return `${html.slice(0, start)}${open} ${initialAttributes()}${html.slice(end)}`
}
