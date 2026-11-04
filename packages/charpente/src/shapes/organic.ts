import type { ShapeDef } from '../types'

const random = (seed: number): (() => number) => {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

const fixed = (value: number): number => Math.round(value * 10) / 10

export const blobPath = (seed: number, size = 100, points = 8, variance = 0.22): string => {
  const rand = random(seed)
  const center = size / 2
  const ring = Array.from({ length: points }, (_, index) => {
    const angle = (index / points) * Math.PI * 2
    const radius = center * (1 - variance + rand() * variance) * 0.96
    return [center + Math.cos(angle) * radius, center + Math.sin(angle) * radius] as const
  })
  const at = (index: number): readonly [number, number] => ring[(index + points) % points] as readonly [number, number]
  const curves = ring.map((_, index) => {
    const [x0, y0] = at(index - 1)
    const [x1, y1] = at(index)
    const [x2, y2] = at(index + 1)
    const [x3, y3] = at(index + 2)
    const controls = [x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6, x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6, x2, y2]
    return `C${controls.map(fixed).join(' ')}`
  })
  const [startX, startY] = at(0)
  return `M${fixed(startX)} ${fixed(startY)}${curves.join('')}Z`
}

export const blob = (seed: number, variance = 0.22): ShapeDef => ({
  viewBox: [100, 100],
  layers: [{ name: 'Blob', path: blobPath(seed, 100, 8, variance), role: 'body' }],
})

export const organicCard = (seed: number, width = 240, height = 160): ShapeDef => {
  const rand = random(seed)
  const corner = (): number => fixed(12 + rand() * 30)
  const [a, b, c, d] = [corner(), corner(), corner(), corner()]
  const path = [
    `M${a} 0H${width - b}Q${width} 0 ${width} ${b}V${height - c}`,
    `Q${width} ${height} ${width - c} ${height}H${d}Q0 ${height} 0 ${height - d}V${a}Q0 0 ${a} 0Z`,
  ].join('')
  return { viewBox: [width, height], layers: [{ name: 'Card', path, role: 'body' }], stretch: true }
}
