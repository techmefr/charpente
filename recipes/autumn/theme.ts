import type { ThemeDef } from 'charpente'

const rand = (seed: number): (() => number) => {
  let state = seed >>> 0
  return () => (state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296
}

const image = (body: string, width: number, height: number): string =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${body}</svg>`)}")`

interface Layer {
  seed: number
  width: number
  height: number
  count: number
  min: number
  max: number
  dx: number
  dy: number
  shape: (radius: number, next: () => number) => string
}

const scatter = ({ seed, width, height, count, min, max, shape }: Layer): string => {
  const next = rand(seed)
  const body = Array.from({ length: count }, () => {
    const radius = min + next() * (max - min)
    const x = radius * 1.6 + next() * (width - radius * 3.2)
    const y = next() * height
    const drawn = shape(radius, next)
    const at = (shift: number): string => `<g transform="translate(${x.toFixed(1)} ${(y + shift).toFixed(1)})">${drawn}</g>`
    return at(0) + (y < radius * 2 ? at(height) : '') + (y > height - radius * 2 ? at(-height) : '')
  })
  return image(body.join(''), width, height)
}

const SCALE = { text: 0.45, media: 0.8, control: 0.55, block: 1 }

const paintOf = (type: keyof typeof SCALE, layers: Layer[], ground: string) => {
  const scale = SCALE[type]
  const shift = (tiles: number, extent: number): string => `calc(var(--charpente-flow) * ${(tiles * extent * scale).toFixed(1)}px)`
  return {
    fill: [...layers.map(scatter), ground].join(', '),
    size: layers.map(({ width, height }) => `${(width * scale).toFixed(1)}px ${(height * scale).toFixed(1)}px`).join(', '),
    position: layers.map(({ width, height, dx, dy }) => `${shift(dx, width)} ${shift(dy, height)}`).join(', '),
    style: type === 'text' ? { borderRadius: '3px', borderStyle: 'none !important', borderWidth: '0 !important', borderImage: 'none !important' } : { borderRadius: type === 'control' ? '999px' : '8px' },
  }
}

const LAYERS: Layer[] = [
  { seed: 9, width: 91, height: 117, count: 5, min: 2.8, max: 3.8, dx: -1, dy: 1, shape: (radius, next) => {
      const colors = ['#c2410c', '#d97706', '#b45309', '#a16207']
      const turn = (next() * 360).toFixed(0)
      const fill = colors[Math.floor(next() * colors.length)] as string
      return `<g transform="rotate(${turn}) scale(${(radius / 3).toFixed(2)})"><path d="M0-4C3.4-3 4 1 0 4C-4 1-3.4-3 0-4Z" fill="${fill}" opacity=".9"/><path d="M0-3.4V4" stroke="#7c2d12" stroke-width=".4"/></g>`
    } },
  { seed: 21, width: 139, height: 173, count: 4, min: 3.8, max: 5.2, dx: 1, dy: 1, shape: (radius, next) => {
      const colors = ['#c2410c', '#d97706', '#b45309', '#a16207']
      const turn = (next() * 360).toFixed(0)
      const fill = colors[Math.floor(next() * colors.length)] as string
      return `<g transform="rotate(${turn}) scale(${(radius / 3).toFixed(2)})"><path d="M0-4C3.4-3 4 1 0 4C-4 1-3.4-3 0-4Z" fill="${fill}" opacity=".9"/><path d="M0-3.4V4" stroke="#7c2d12" stroke-width=".4"/></g>`
    } },
  { seed: 30, width: 63, height: 77, count: 4, min: 2.2, max: 3, dx: -1, dy: 1, shape: (radius, next) => {
      const colors = ['#c2410c', '#d97706', '#b45309', '#a16207']
      const turn = (next() * 360).toFixed(0)
      const fill = colors[Math.floor(next() * colors.length)] as string
      return `<g transform="rotate(${turn}) scale(${(radius / 3).toFixed(2)})"><path d="M0-4C3.4-3 4 1 0 4C-4 1-3.4-3 0-4Z" fill="${fill}" opacity=".9"/><path d="M0-3.4V4" stroke="#7c2d12" stroke-width=".4"/></g>`
    } },
]

const season = (): ThemeDef['paint'] => {
  const ground = 'linear-gradient(180deg, color-mix(in srgb, var(--charpente-base) 80%, #fff), var(--charpente-base))'
  return {
    text: paintOf('text', LAYERS, ground),
    media: paintOf('media', LAYERS, ground),
    control: paintOf('control', LAYERS, ground),
    block: paintOf('block', LAYERS, ground),
  }
}

const BORDER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect x="16.5" y="16.5" width="27" height="27" fill="none" stroke="#b45309" stroke-width="2"/><rect x="11.5" y="11.5" width="37" height="37" fill="none" stroke="#f59e0b" stroke-width=".8"/><g transform="translate(8 8) rotate(45)"><path d="M0-4C3.4-3 4 1 0 4C-4 1-3.4-3 0-4Z" fill="#c2410c"/><path d="M0-3.4V4" stroke="#7c2d12" stroke-width=".4"/></g><g transform="translate(52 52) rotate(225)"><path d="M0-4C3.4-3 4 1 0 4C-4 1-3.4-3 0-4Z" fill="#c2410c"/><path d="M0-3.4V4" stroke="#7c2d12" stroke-width=".4"/></g></svg>`

export default {
  tokens: { base: '#f6dcb5', strong: '#d99a4e', accent: '#c2410c', accent2: '#d97706' },
  dark: { base: '#33220f', strong: '#8a5a22', shine: 'rgba(255,255,255,0.16)' },
  motion: 'leaves',
  paint: season(),
  border: { image: BORDER, slice: 20, width: '14px' },
} satisfies ThemeDef
