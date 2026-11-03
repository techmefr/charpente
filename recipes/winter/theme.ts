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
  { seed: 3, width: 71, height: 93, count: 10, min: 1.3, max: 2, dx: 0, dy: 1, shape: (radius, next) =>
      radius > 3.2
        ? `<path d="M0 ${-radius}V${radius}M${(-radius * 0.87).toFixed(1)} ${(-radius / 2).toFixed(1)}L${(radius * 0.87).toFixed(1)} ${(radius / 2).toFixed(1)}M${(-radius * 0.87).toFixed(1)} ${(radius / 2).toFixed(1)}L${(radius * 0.87).toFixed(1)} ${(-radius / 2).toFixed(1)}" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="${(0.75 + next() * 0.2).toFixed(2)}"/>`
        : `<circle r="${radius.toFixed(1)}" fill="#ffffff" stroke="#9fd0ea" stroke-width=".4" opacity="${(0.8 + next() * 0.2).toFixed(2)}"/>` },
  { seed: 8, width: 109, height: 139, count: 9, min: 2.1, max: 3.1, dx: -1, dy: 1, shape: (radius, next) =>
      radius > 3.2
        ? `<path d="M0 ${-radius}V${radius}M${(-radius * 0.87).toFixed(1)} ${(-radius / 2).toFixed(1)}L${(radius * 0.87).toFixed(1)} ${(radius / 2).toFixed(1)}M${(-radius * 0.87).toFixed(1)} ${(radius / 2).toFixed(1)}L${(radius * 0.87).toFixed(1)} ${(-radius / 2).toFixed(1)}" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="${(0.75 + next() * 0.2).toFixed(2)}"/>`
        : `<circle r="${radius.toFixed(1)}" fill="#ffffff" stroke="#9fd0ea" stroke-width=".4" opacity="${(0.8 + next() * 0.2).toFixed(2)}"/>` },
  { seed: 14, width: 167, height: 211, count: 7, min: 3.4, max: 5, dx: 1, dy: 1, shape: (radius, next) =>
      radius > 3.2
        ? `<path d="M0 ${-radius}V${radius}M${(-radius * 0.87).toFixed(1)} ${(-radius / 2).toFixed(1)}L${(radius * 0.87).toFixed(1)} ${(radius / 2).toFixed(1)}M${(-radius * 0.87).toFixed(1)} ${(radius / 2).toFixed(1)}L${(radius * 0.87).toFixed(1)} ${(-radius / 2).toFixed(1)}" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="${(0.75 + next() * 0.2).toFixed(2)}"/>`
        : `<circle r="${radius.toFixed(1)}" fill="#ffffff" stroke="#9fd0ea" stroke-width=".4" opacity="${(0.8 + next() * 0.2).toFixed(2)}"/>` },
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

const BORDER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M0 11C3 3 9 3 10 9C11 4 17 5 20 11C23 3 29 3 30 9C31 4 37 5 40 11C43 3 49 3 50 9C51 4 57 5 60 11V17H0Z" fill="#ffffff" stroke="#bfdff0" stroke-width=".6"/><rect x="18.5" y="18.5" width="23" height="23" fill="none" stroke="#9fd0ea" stroke-width="1.4"/></svg>`

export default {
  tokens: { base: '#a9cfe8', strong: '#7fb6d9', accent: '#38bdf8', accent2: '#818cf8' },
  dark: { base: '#16293b', strong: '#3b6a8c', shine: 'rgba(255,255,255,0.16)' },
  motion: 'snow',
  paint: season(),
  border: { image: BORDER, slice: 20, width: '14px' },
} satisfies ThemeDef
