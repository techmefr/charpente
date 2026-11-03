import { declarations, flat, splitTopLevel } from '../css'
import type { ShapeOverlay } from '../shapes'
import type { Paint, PaintType } from '../types'
import { TYPE_SELECTORS, within } from './selectors'

export interface Shaped {
  overlay?: ShapeOverlay
}

const UNDERLAY = flat('var(--charpente-base)')

export const fillDeclarations = (type: PaintType, paint: Paint, shaped?: Shaped): string[] => {
  const overlay = shaped?.overlay
  const layers = [...splitTopLevel(paint.fill ?? flat('var(--charpente-base)')), ...(shaped ? [UNDERLAY] : [])]
  const sizes = paint.size ? splitTopLevel(paint.size) : []
  const sizeList = layers.map((_, index) => sizes[index] ?? 'auto')
  const above = overlay ? [overlay] : []
  const images = [...above.map((layer) => layer.image), ...layers]
  return [
    'background-color: transparent !important',
    `background-image: var(--charpente-shine-layer, none), ${images.join(', ')} !important`,
    `background-size: 60% 100%, ${[...above.map((layer) => layer.size), ...sizeList].join(', ')} !important`,
    `background-repeat: no-repeat, ${[...above.map(() => 'no-repeat'), ...layers.map(() => 'repeat')].join(', ')} !important`,
    `background-position: var(--charpente-shine-x, -80%) 0, ${[...above.map(() => 'center'), ...layers.map(() => '0 0')].join(', ')} !important`,
    `background-attachment: var(--charpente-shine-attachment, scroll), ${images.map(() => 'scroll').join(', ')} !important`,
    ...(type === 'text'
      ? ['background-clip: content-box !important', 'background-origin: content-box !important']
      : []),
  ]
}

export const paintRule = (
  type: PaintType,
  paint: Paint,
  scopes: string[],
  selector = TYPE_SELECTORS[type],
  extra: { shaped?: Shaped; mask?: string[] } = {},
): string => {
  const body = [...fillDeclarations(type, paint, extra.shaped), declarations(paint.style), ...(extra.mask ?? [])]
    .filter(Boolean)
    .join(';\n  ')
  return `${within(scopes, selector)} {\n  ${body};\n}`
}
