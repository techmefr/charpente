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
  { seed: 5, width: 83, height: 101, count: 6, min: 2.2, max: 3.2, dx: 1, dy: 1, shape: (radius, next) => {
      const turn = (next() * 180).toFixed(0)
      return `<ellipse rx="${(radius * 1.2).toFixed(1)}" ry="${(radius * 0.65).toFixed(1)}" transform="rotate(${turn})" fill="${next() > 0.5 ? '#ec4899' : '#f472b6'}" opacity=".9"/>`
    } },
  { seed: 12, width: 127, height: 157, count: 5, min: 3.2, max: 4.6, dx: -1, dy: 1, shape: (radius, next) => {
      const turn = (next() * 180).toFixed(0)
      return `<ellipse rx="${(radius * 1.2).toFixed(1)}" ry="${(radius * 0.65).toFixed(1)}" transform="rotate(${turn})" fill="${next() > 0.5 ? '#ec4899' : '#f472b6'}" opacity=".9"/>`
    } },
  { seed: 19, width: 61, height: 79, count: 5, min: 1.6, max: 2.4, dx: 1, dy: 1, shape: (radius, next) => {
      const turn = (next() * 180).toFixed(0)
      return `<ellipse rx="${(radius * 1.2).toFixed(1)}" ry="${(radius * 0.65).toFixed(1)}" transform="rotate(${turn})" fill="${next() > 0.5 ? '#ec4899' : '#f472b6'}" opacity=".9"/>`
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

const BORDER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect x="16.5" y="16.5" width="27" height="27" fill="none" stroke="#65a30d" stroke-width="1.6"/><g transform="translate(8 8)"><circle cx="0" cy="-2.6" r="1.9" fill="#f9a8d4"/><circle cx="2.5" cy="-.8" r="1.9" fill="#f9a8d4"/><circle cx="1.5" cy="2.1" r="1.9" fill="#f9a8d4"/><circle cx="-1.5" cy="2.1" r="1.9" fill="#f9a8d4"/><circle cx="-2.5" cy="-.8" r="1.9" fill="#f9a8d4"/><circle r="1.3" fill="#facc15"/></g><g transform="translate(52 8)"><circle cx="0" cy="-2.6" r="1.9" fill="#f9a8d4"/><circle cx="2.5" cy="-.8" r="1.9" fill="#f9a8d4"/><circle cx="1.5" cy="2.1" r="1.9" fill="#f9a8d4"/><circle cx="-1.5" cy="2.1" r="1.9" fill="#f9a8d4"/><circle cx="-2.5" cy="-.8" r="1.9" fill="#f9a8d4"/><circle r="1.3" fill="#facc15"/></g><g transform="translate(8 52)"><circle cx="0" cy="-2.6" r="1.9" fill="#f9a8d4"/><circle cx="2.5" cy="-.8" r="1.9" fill="#f9a8d4"/><circle cx="1.5" cy="2.1" r="1.9" fill="#f9a8d4"/><circle cx="-1.5" cy="2.1" r="1.9" fill="#f9a8d4"/><circle cx="-2.5" cy="-.8" r="1.9" fill="#f9a8d4"/><circle r="1.3" fill="#facc15"/></g><g transform="translate(52 52)"><circle cx="0" cy="-2.6" r="1.9" fill="#f9a8d4"/><circle cx="2.5" cy="-.8" r="1.9" fill="#f9a8d4"/><circle cx="1.5" cy="2.1" r="1.9" fill="#f9a8d4"/><circle cx="-1.5" cy="2.1" r="1.9" fill="#f9a8d4"/><circle cx="-2.5" cy="-.8" r="1.9" fill="#f9a8d4"/><circle r="1.3" fill="#facc15"/></g></svg>`

export default {
  tokens: { base: '#bfe6ae', strong: '#86c76b', accent: '#f472b6', accent2: '#a3e635' },
  dark: { base: '#1d3023', strong: '#4f8a3f', shine: 'rgba(255,255,255,0.16)' },
  motion: 'petals',
  paint: season(),
  border: { image: BORDER, slice: 20, width: '14px' },
} satisfies ThemeDef
