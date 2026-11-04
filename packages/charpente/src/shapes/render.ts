import type { ShapeDef, ShapeRole } from '../types'

export interface ShapeColors {
  accent: string
  accent2: string
}

export interface ShapeOverlay {
  image: string
  size: string
}

const FILLS: Record<Exclude<ShapeRole, 'body'>, (colors: ShapeColors) => string> = {
  accent: (colors) => `fill="${colors.accent}"`,
  accent2: (colors) => `fill="${colors.accent2}"`,
  detail: () => 'fill="#000" fill-opacity=".2"',
  shine: () => 'fill="#fff" fill-opacity=".38"',
}

const sizeOf = (shape: ShapeDef): string => (shape.stretch ? '100% 100%' : 'contain')

const imageOf = (shape: ShapeDef, body: string): string => {
  const [width, height] = shape.viewBox
  const ratio = shape.stretch ? ' preserveAspectRatio="none"' : ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"${ratio}>${body}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}")`
}

export const shapeOverlay = (shape: ShapeDef, colors: ShapeColors): ShapeOverlay | undefined => {
  const body = shape.layers
    .filter((layer) => layer.role !== 'body')
    .map((layer) => `<path d="${layer.path}" ${FILLS[layer.role as Exclude<ShapeRole, 'body'>](colors)}/>`)
    .join('')
  return body ? { image: imageOf(shape, body), size: sizeOf(shape) } : undefined
}

export const maskDeclarations = (shape: ShapeDef): string[] => {
  const silhouette = imageOf(shape, shape.layers.map((layer) => `<path d="${layer.path}"/>`).join(''))
  const entries = [['image', silhouette], ['size', sizeOf(shape)], ['repeat', 'no-repeat'], ['position', 'center']]
  return [
    `--charpente-shape-mask: ${silhouette}`,
    `--charpente-shape-fit: ${sizeOf(shape)}`,
    ...entries.flatMap(([name, value]) => [`mask-${name}: ${value}`, `-webkit-mask-${name}: ${value}`]),
    'outline: none',
    'box-shadow: none',
    'border-radius: 0',
  ]
}
