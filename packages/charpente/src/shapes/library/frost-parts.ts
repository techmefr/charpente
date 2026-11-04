const n = (value: number): number => Math.round(value * 10) / 10

const WIDTHS = [1, 1.7, 0.8, 1.4, 1.1, 0.7, 1.6, 1, 1.3, 0.9]
const RISES = [4, 2, 6, 3, 5, 2, 6, 3, 5, 2]
const DRIPS = [3, 7, 2, 6, 3, 8, 2, 5, 4, 6]

const spans = (width: number, weights: number[]): number[] => {
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  let at = 0
  return [0, ...weights.map((weight) => (at += (weight / total) * width))]
}

export const snowCap = (width: number, base: number, scale: number, offset = 0): string => {
  const edges = spans(width, WIDTHS)
  const top = base + offset
  const drop = top + 9 * scale
  const humps = RISES.map((rise, index) => {
    const [from, to] = [edges[index] as number, edges[index + 1] as number]
    return `Q${n((from + to) / 2)} ${n(top - rise * scale * 2)} ${n(to)} ${n(top)}`
  })
  const drips = DRIPS.map((depth, index) => {
    const last = DRIPS.length - 1 - index
    const [from, to] = [edges[last] as number, edges[last + 1] as number]
    return `Q${n((from + to) / 2)} ${n(drop + depth * scale * 1.3)} ${n(from)} ${n(drop)}`
  })
  return `M0 ${n(top)}${humps.join('')}V${n(drop)}${drips.join('')}Z`
}

const quad = (from: [number, number], to: [number, number], start: number, end: number): string => {
  const [dx, dy] = [to[0] - from[0], to[1] - from[1]]
  const length = Math.hypot(dx, dy)
  const [nx, ny] = [-dy / length, dx / length]
  const point = (base: [number, number], half: number, side: number): string => `${n(base[0] + nx * half * side)} ${n(base[1] + ny * half * side)}`
  return `M${point(from, start / 2, 1)}L${point(to, end / 2, 1)}L${point(to, end / 2, -1)}L${point(from, start / 2, -1)}Z`
}

export const fern = (size: number, turned: boolean): string => {
  const stem = size * 0.88
  const unit = Math.SQRT1_2
  const parts = [quad([1, 1], [1 + stem * unit, 1 + stem * unit], 1.8, 0.6)]
  const count = 9
  for (let index = 0; index < count; index++) {
    const along = 0.1 + (0.8 * index) / (count - 1)
    const origin: [number, number] = [1 + stem * along * unit, 1 + stem * along * unit]
    const length = size * 0.36 * (1 - along) + size * 0.1
    for (const side of [-1, 1]) {
      const angle = Math.PI / 4 + side * 0.87
      parts.push(quad(origin, [origin[0] + Math.cos(angle) * length, origin[1] + Math.sin(angle) * length], 1.4, 0.4))
    }
  }
  const path = parts.join('')
  if (!turned) return path
  return path.replace(/-?\d+(?:\.\d+)?/g, (value) => String(n(size - Number(value))))
}
