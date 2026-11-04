export const rand = (seed: number): (() => number) => {
  let state = seed >>> 0
  return () => (state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296
}

export const image = (body: string, width: number, height: number): string =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${body}</svg>`)}")`

const n = (value: number): string => value.toFixed(1)

export type Motif = (next: () => number) => string

export const flake = (radius: number, color: string): Motif => (next) => {
  const arm = `M0 0V${n(-radius)}M0 ${n(-radius * 0.5)}l${n(-radius * 0.24)} ${n(-radius * 0.2)}M0 ${n(-radius * 0.5)}l${n(radius * 0.24)} ${n(-radius * 0.2)}`
  const arms = [0, 60, 120, 180, 240, 300].map((angle) => `<path d="${arm}" transform="rotate(${angle})"/>`).join('')
  return `<g transform="rotate(${n(next() * 60)})" stroke="${color}" stroke-width="1.5" stroke-linecap="round" fill="none">${arms}<circle r="1.6" fill="${color}" stroke="none"/></g>`
}

export const branch = (length: number): Motif => (next) => {
  const needles = Array.from({ length: 11 }, (_, index) => {
    const y = -length * ((index + 1) / 12)
    const reach = length * 0.3 * (1 - 0.55 * (index / 11)) + 3
    return `<path d="M0 ${n(y)}L${n(reach)} ${n(y - reach * 0.6)}M0 ${n(y)}L${n(-reach)} ${n(y - reach * 0.6)}"/>`
  })
  const tip = `<path d="M0 ${n(-length)}l0 -6"/>`
  return `<g transform="rotate(${n(next() * 360)})" stroke="#3f6b3a" stroke-width="1.8" stroke-linecap="round" fill="none"><path d="M0 0V${n(-length)}" stroke="#5b4a2a" stroke-width="1.4"/>${needles.join('')}${tip}</g>`
}

export const berries: Motif = (next) => {
  const dot = (x: number, y: number): string => `<circle cx="${x}" cy="${y}" r="3.4" fill="#b3202b"/><circle cx="${x - 1}" cy="${y - 1.2}" r="1" fill="#fff" opacity=".55"/>`
  return `<g transform="rotate(${n(next() * 360)})"><path d="M0 0Q6 -8 13 -10M6 -5Q8 -13 4 -16" stroke="#5b4a2a" stroke-width="1" fill="none"/>${dot(13, -10)}${dot(4, -16)}${dot(-2, -4)}</g>`
}

export const tree = (height: number, color: string): Motif => () => {
  const tier = (top: number, bottom: number, half: number): string => `<path d="M0 ${n(top)}L${n(half)} ${n(bottom)}L${n(-half)} ${n(bottom)}Z" fill="${color}"/>`
  const trunk = `<rect x="${n(-height * 0.07)}" y="0" width="${n(height * 0.14)}" height="${n(height * 0.14)}" fill="#6b4a2b"/>`
  return `${trunk}${tier(-height, -height * 0.52, height * 0.28)}${tier(-height * 0.78, -height * 0.24, height * 0.38)}${tier(-height * 0.5, 0, height * 0.5)}`
}

export interface Scatter {
  motif: Motif
  columns: number
  rows: number
  radius: number
  seed: number
}

export const tile = (width: number, height: number, ground: { speckle: string; seed: number } | undefined, scatters: Scatter[]): string => {
  const speckles = ground
    ? Array.from({ length: 70 }, ((next) => () => `<circle cx="${n(next() * width)}" cy="${n(next() * height)}" r="${n(0.4 + next() * 0.7)}" fill="${ground.speckle}" opacity=".5"/>`)(rand(ground.seed))).join('')
    : ''
  const groups = scatters.flatMap(({ motif, columns, rows, radius, seed }) => {
    const next = rand(seed)
    return Array.from({ length: columns * rows }, (_, index) => {
      const x = ((index % columns) + 0.5 + (next() - 0.5) * 0.7) * (width / columns)
      const y = (Math.floor(index / columns) + 0.5 + (next() - 0.5) * 0.7) * (height / rows)
      const drawn = motif(next)
      const at = (dx: number, dy: number): string => `<g transform="translate(${n(x + dx)} ${n(y + dy)})">${drawn}</g>`
      const shifts = [[0, 0], [x < radius ? width : x > width - radius ? -width : 0, 0]]
      return shifts.map(([dx]) => at(dx as number, y < radius ? height : y > height - radius ? -height : 0)).join('') + at(0, 0)
    })
  })
  return image(speckles + groups.join(''), width, height)
}
