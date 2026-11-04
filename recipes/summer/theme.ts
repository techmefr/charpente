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
  { seed: 7, width: 89, height: 113, count: 6, min: 1.6, max: 2.6, dx: 0, dy: -1, shape: (radius, next) =>
      next() > 0.5
        ? `<path d="M0 ${-radius * 1.6}Q0 0 ${radius * 1.6} 0Q0 0 0 ${radius * 1.6}Q0 0 ${-radius * 1.6} 0Q0 0 0 ${-radius * 1.6}Z" fill="#fff8c9" opacity=".95"/>`
        : `<circle r="${radius.toFixed(1)}" fill="#ffffff" fill-opacity=".22" stroke="#ffffff" stroke-opacity=".85" stroke-width=".7"/><circle cx="${(-radius * 0.35).toFixed(1)}" cy="${(-radius * 0.35).toFixed(1)}" r="${(radius * 0.22).toFixed(1)}" fill="#ffffff"/>` },
  { seed: 16, width: 131, height: 167, count: 5, min: 2.6, max: 4, dx: 1, dy: -1, shape: (radius, next) =>
      next() > 0.5
        ? `<path d="M0 ${-radius * 1.6}Q0 0 ${radius * 1.6} 0Q0 0 0 ${radius * 1.6}Q0 0 ${-radius * 1.6} 0Q0 0 0 ${-radius * 1.6}Z" fill="#fff8c9" opacity=".95"/>`
        : `<circle r="${radius.toFixed(1)}" fill="#ffffff" fill-opacity=".22" stroke="#ffffff" stroke-opacity=".85" stroke-width=".7"/><circle cx="${(-radius * 0.35).toFixed(1)}" cy="${(-radius * 0.35).toFixed(1)}" r="${(radius * 0.22).toFixed(1)}" fill="#ffffff"/>` },
  { seed: 23, width: 67, height: 83, count: 5, min: 1.2, max: 1.8, dx: -1, dy: 0, shape: (radius, next) =>
      next() > 0.5
        ? `<path d="M0 ${-radius * 1.6}Q0 0 ${radius * 1.6} 0Q0 0 0 ${radius * 1.6}Q0 0 ${-radius * 1.6} 0Q0 0 0 ${-radius * 1.6}Z" fill="#fff8c9" opacity=".95"/>`
        : `<circle r="${radius.toFixed(1)}" fill="#ffffff" fill-opacity=".22" stroke="#ffffff" stroke-opacity=".85" stroke-width=".7"/><circle cx="${(-radius * 0.35).toFixed(1)}" cy="${(-radius * 0.35).toFixed(1)}" r="${(radius * 0.22).toFixed(1)}" fill="#ffffff"/>` },
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

const BORDER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect x="16.5" y="16.5" width="27" height="27" fill="none" stroke="#f59e0b" stroke-width="2"/><rect x="11.5" y="11.5" width="37" height="37" fill="none" stroke="#fcd34d" stroke-width="1"/><circle cx="8" cy="8" r="3" fill="#fb923c"/><circle cx="52" cy="8" r="3" fill="#fb923c"/><circle cx="8" cy="52" r="3" fill="#fb923c"/><circle cx="52" cy="52" r="3" fill="#fb923c"/></svg>`

export default {
  tokens: { base: '#f6c05a', strong: '#f6b042', accent: '#f97316', accent2: '#22d3ee' },
  dark: { base: '#3a2a12', strong: '#a8741f', shine: 'rgba(255,255,255,0.16)' },
  motion: 'sparkle',
  paint: season(),
  border: { image: BORDER, slice: 20, width: '14px' },
} satisfies ThemeDef
