import type { ShapeDef, ShapeLayer } from '../types'
import { fillOf, type ShapeColors } from './fills'

export type { ShapeColors } from './fills'

export interface ShapeOverlay {
  image: string
  size: string
  count: number
  position: string
}

interface Group {
  viewBox: [number, number]
  layers: ShapeLayer[]
  size: string
  position: string
  stretch: boolean
}

const groupsOf = (shape: ShapeDef): Group[] => {
  const main = { viewBox: shape.viewBox, layers: shape.layers, size: shape.stretch ? '100% 100%' : 'contain', position: 'center', stretch: Boolean(shape.stretch) }
  const fixed = [shape.fixed ?? []].flat().map((part) => ({ ...part, position: part.position ?? 'center', stretch: false }))
  return [main, ...fixed]
}

const imageOf = (group: Group, body: string): string => {
  const [width, height] = group.viewBox
  const ratio = group.stretch ? ' preserveAspectRatio="none"' : ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"${ratio}>${body}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}")`
}

const paintedOf = (group: Group, colors: ShapeColors): string | undefined => {
  const parts = group.layers.flatMap((layer, index) => {
    if (layer.role === 'body') return []
    const fill = fillOf(layer, colors, `g${index}`)
    return [{ defs: fill.defs, path: `<path d="${layer.path}" ${fill.attr}/>` }]
  })
  if (parts.length === 0) return undefined
  const defs = parts.map((part) => part.defs).join('')
  return imageOf(group, (defs ? `<defs>${defs}</defs>` : '') + parts.map((part) => part.path).join(''))
}

export const shapeOverlay = (shape: ShapeDef, colors: ShapeColors): ShapeOverlay | undefined => {
  const painted = groupsOf(shape)
    .map((group) => ({ image: paintedOf(group, colors), size: group.size, position: group.position }))
    .filter((entry): entry is { image: string; size: string; position: string } => entry.image !== undefined)
    .reverse()
  if (painted.length === 0) return undefined
  return { image: painted.map((entry) => entry.image).join(', '), size: painted.map((entry) => entry.size).join(', '), count: painted.length, position: painted.map((entry) => entry.position).join(', ') }
}

export const maskDeclarations = (shape: ShapeDef): string[] => {
  const groups = groupsOf(shape)
  const silhouettes = groups.map((group) => imageOf(group, group.layers.map((layer) => `<path d="${layer.path}"/>`).join('')))
  const entries = [['image', silhouettes.join(', ')], ['size', groups.map((group) => group.size).join(', ')], ['repeat', 'no-repeat'], ['position', groups.map((group) => group.position).join(', ')]]
  return [
    `--charpente-shape-mask: ${silhouettes[0]}`,
    `--charpente-shape-fit: ${groups[0]?.size}`,
    ...entries.flatMap(([name, value]) => [`mask-${name}: ${value}`, `-webkit-mask-${name}: ${value}`]),
    'outline: none',
    'box-shadow: none',
    'border-radius: 0',
  ]
}
