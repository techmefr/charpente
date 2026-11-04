import type { ShapeDef, ShapeLayer } from '../../types'
import { rrect } from '../geometry'

export interface GiftBox {
  width: number
  height: number
  top: number
  cap: number
  bow: { width: number; height: number; base: number }
  ribbon: number
  lid?: number
  band?: boolean
  tails?: boolean
}

const n = (value: number): number => Math.round(value * 10) / 10

const loop = (box: GiftBox, side: 1 | -1, points: number[]): string => {
  const { bow } = box
  const at = (x: number, y: number): string => `${n(box.width / 2 + side * x * bow.width)} ${n(bow.base + y * bow.height)}`
  const [a, b, c, d, e, f, g, h, i, j, k, l, m, o] = points as [number, number, number, number, number, number, number, number, number, number, number, number, number, number]
  return `M${at(a, b)}C${at(c, d)} ${at(e, f)} ${at(g, h)}C${at(i, j)} ${at(k, l)} ${at(m, o)}Z`
}

const OUTER = [0, 0, -0.405, -1, -1, -0.68, -0.73, -0.14, -0.54, 0.18, -0.16, 0.11, 0, 0]
const INNER = [-0.08, -0.07, -0.32, -0.64, -0.7, -0.5, -0.57, -0.18, -0.43, 0.04, -0.22, 0, -0.08, -0.07]

const snowCap = (box: GiftBox): string => {
  const { width, top, cap } = box
  const count = Math.max(4, Math.round(width / (cap * 3.4)))
  const step = (width - 4) / count
  const edge = top + cap * 0.6
  const humps = Array.from({ length: count }, (_, i) => `Q${n(2 + step * (i + 0.5))} ${n(top - cap * 0.5)} ${n(2 + step * (i + 1))} ${n(edge)}`)
  const drips = Array.from({ length: count + 1 }, (_, i) => {
    const x = 2 + step * (count - i)
    return `Q${n(x + step * 0.25)} ${n(edge + cap * (i % 2 ? 1.1 : 0.7))} ${n(x - step * 0.5)} ${n(edge + cap * 0.2)}`
  })
  return `M2 ${n(edge)}${humps.join('')}${drips.slice(0, count).join('')}Z`
}

const ribbons = (box: GiftBox): ShapeLayer[] => {
  const left = n(box.width / 2 - box.ribbon / 2)
  const edge = n(box.ribbon * 0.16)
  const stripe = (x: number, y: number, w: number, h: number): string => `M${x} ${y}H${n(x + w)}V${n(y + h)}H${x}Z`
  const layers: ShapeLayer[] = [{ name: 'Vertical ribbon', path: stripe(left, box.top, box.ribbon, box.height - box.top), role: 'accent' }]
  if (box.band) {
    const y = n(box.top + (box.height - box.top) * 0.5)
    const h = n((box.height - box.top) * 0.2)
    layers.push({ name: 'Horizontal ribbon', path: stripe(0, y, box.width, h), role: 'accent' })
    layers.push({ name: 'Ribbon edges', path: stripe(0, y, box.width, n(h * 0.18)) + stripe(0, n(y + h * 0.82), box.width, n(h * 0.18)), role: 'detail' })
  }
  const sides = stripe(left, box.top, edge, box.height - box.top) + stripe(n(left + box.ribbon - edge), box.top, edge, box.height - box.top)
  return [...layers, { name: 'Ribbon sides', path: sides, role: 'detail' }]
}

const bowLayers = (box: GiftBox): ShapeLayer[] => {
  const { bow } = box
  const x = box.width / 2
  const knot = (radius: number): string => {
    const rx = n(bow.width * radius)
    const ry = n(bow.height * radius * 1.1)
    return `M${n(x - rx)} ${bow.base}a${rx} ${ry} 0 1 0 ${n(rx * 2)} 0a${rx} ${ry} 0 1 0 ${n(-rx * 2)} 0Z`
  }
  const tail = (side: 1 | -1): string => {
    const at = (dx: number, dy: number): string => `${n(x + side * dx * bow.width)} ${n(bow.base + dy * bow.height)}`
    return `M${at(0.08, 0.1)}L${at(0.42, 0.62)}L${at(0.2, 0.66)}L${at(0, 0.2)}Z`
  }
  const tails = box.tails ? [{ name: 'Tails', path: tail(1) + tail(-1), role: 'accent' as const }] : []
  return [
    { name: 'Left loop', path: loop(box, 1, OUTER), role: 'accent' },
    { name: 'Right loop', path: loop(box, -1, OUTER), role: 'accent' },
    { name: 'Left loop shade', path: loop(box, 1, INNER), role: 'detail' },
    { name: 'Right loop shade', path: loop(box, -1, INNER), role: 'detail' },
    ...tails,
    { name: 'Knot', path: knot(0.17), role: 'accent' },
  ]
}

export const giftBox = (box: GiftBox): ShapeDef => {
  const body = rrect(0, box.top, box.width, box.height - box.top, Math.min(4, box.cap))
  const lid = box.lid ? [{ name: 'Lid shadow', path: `M0 ${box.top + box.lid}H${box.width}v${n(box.lid * 0.14)}H0Z`, role: 'detail' as const }] : []
  return {
    viewBox: [box.width, box.height],
    stretch: true,
    layers: [{ name: 'Box', path: body, role: 'body' }, ...lid, ...ribbons(box), { name: 'Snow cap', path: snowCap(box), role: 'accent2' }, ...bowLayers(box)],
  }
}
