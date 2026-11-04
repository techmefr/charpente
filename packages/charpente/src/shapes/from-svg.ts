import type { ShapeDef, ShapeRole } from '../types'

interface Piece {
  fill: string
  path: string
  area: number
}

const TAG = /<(path|rect|circle|ellipse|polygon)\b([^>]*)>/gi
const ROLES: ShapeRole[] = ['accent', 'accent2', 'detail', 'shine']

const attribute = (attributes: string, name: string): string | undefined =>
  new RegExp(String.raw`(?:^|\s)${name}\s*=\s*["']([^"']*)["']`, 'i').exec(attributes)?.[1]

const fillOf = (attributes: string): string => {
  const style = /fill\s*:\s*([^;"']+)/i.exec(attributes)?.[1]
  return (attribute(attributes, 'fill') ?? style ?? '#000000').trim().toLowerCase()
}

const numbers = (text: string): number[] => (text.match(/-?\d*\.?\d+(?:e-?\d+)?/gi) ?? []).map(Number)

const boxArea = (values: number[]): number => {
  const xs = values.filter((_, index) => index % 2 === 0)
  const ys = values.filter((_, index) => index % 2 === 1)
  return xs.length === 0 ? 0 : (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys))
}

const pieceOf = (tag: string, attributes: string): Piece | undefined => {
  const fill = fillOf(attributes)
  const value = (name: string): number => Number(attribute(attributes, name) ?? 0)
  if (fill === 'none') return undefined
  if (tag === 'path') {
    const path = attribute(attributes, 'd')
    return path ? { fill, path, area: boxArea(numbers(path)) } : undefined
  }
  if (tag === 'rect') {
    const [x, y, width, height] = [value('x'), value('y'), value('width'), value('height')]
    return { fill, path: `M${x} ${y}h${width}v${height}h${-width}Z`, area: width * height }
  }
  if (tag === 'polygon') {
    const points = numbers(attribute(attributes, 'points') ?? '')
    const path = points.map((point, index) => `${index === 0 ? 'M' : index % 2 === 0 ? 'L' : ' '}${point}`).join('')
    return { fill, path: `${path}Z`, area: boxArea(points) }
  }
  const [rx, ry] = tag === 'circle' ? [value('r'), value('r')] : [value('rx'), value('ry')]
  return { fill, path: `M${value('cx') - rx} ${value('cy')}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`, area: Math.PI * rx * ry }
}

const boxOf = (svg: string): [number, number] => {
  const box = numbers(/viewBox\s*=\s*["']([^"']*)["']/i.exec(svg)?.[1] ?? '')
  if (box.length === 4) return [box[2] as number, box[3] as number]
  const size = [attribute(svg, 'width'), attribute(svg, 'height')].map((item) => Number.parseFloat(item ?? ''))
  if (size.every((item) => Number.isFinite(item))) return size as [number, number]
  throw new Error('charpente: the SVG needs a viewBox or a width and a height')
}

export const svgToShape = (svg: string): ShapeDef => {
  const pieces = [...svg.matchAll(TAG)].flatMap((match) => pieceOf((match[1] as string).toLowerCase(), match[2] as string) ?? [])
  if (pieces.length === 0) throw new Error('charpente: no filled path, rect, circle, ellipse or polygon found in the SVG')
  const groups = new Map<string, { paths: string[]; area: number }>()
  for (const piece of pieces) {
    const group = groups.get(piece.fill) ?? { paths: [], area: 0 }
    group.paths.push(piece.path)
    group.area += piece.area
    groups.set(piece.fill, group)
  }
  const body = [...groups.entries()].sort((a, b) => b[1].area - a[1].area)[0]?.[0]
  let next = 0
  const layers = [...groups.entries()].map(([fill, group]) => ({
    name: fill,
    path: group.paths.join(''),
    role: fill === body ? ('body' as const) : (ROLES[Math.min(next++, ROLES.length - 1)] as ShapeRole),
  }))
  return { viewBox: boxOf(svg), layers }
}

const words = (name: string): string =>
  name.replace(/[^a-zA-Z0-9]+(.)?/g, (_, letter: string | undefined) => (letter ?? '').toUpperCase()).replace(/^[A-Z]/, (letter) => letter.toLowerCase())

export const shapeIdentifier = (name: string): string => {
  const identifier = words(name)
  return /^[a-z]/.test(identifier) ? identifier : `shape${identifier}`
}

export const shapeSource = (name: string, shape: ShapeDef): string => {
  const layers = shape.layers.map((layer) => `    { name: '${layer.name}', path: '${layer.path}', role: '${layer.role}' },`)
  return [
    "import type { ShapeDef } from 'charpente/shapes'",
    '',
    `export const ${shapeIdentifier(name)}: ShapeDef = {`,
    `  viewBox: [${shape.viewBox.join(', ')}],`,
    '  layers: [',
    ...layers,
    '  ],',
    '}',
    '',
  ].join('\n')
}
