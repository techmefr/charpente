import { declarations, flat, splitTopLevel } from '../css'
import type { Paint, PaintType } from '../types'
import { TYPE_SELECTORS, within } from './selectors'

export const fillDeclarations = (type: PaintType, paint: Paint): string[] => {
  const layers = splitTopLevel(paint.fill ?? flat('var(--charpente-base)'))
  const sizes = paint.size ? splitTopLevel(paint.size) : []
  const sizeList = layers.map((_, index) => sizes[index] ?? 'auto')
  const positions = paint.position ? splitTopLevel(paint.position) : []
  const repeats = paint.repeat ? splitTopLevel(paint.repeat) : []
  const repeatList = layers.map((_, index) => repeats[index] ?? 'repeat')
  const positionList = layers.map((_, index) => positions[index] ?? '0 0')
  return [
    'background-color: transparent !important',
    `background-image: var(--charpente-shine-layer, none), ${layers.join(', ')} !important`,
    `background-size: 60% 100%, ${sizeList.join(', ')} !important`,
    `background-repeat: no-repeat, ${repeatList.join(', ')} !important`,
    `background-position: var(--charpente-shine-x, -80%) 0, ${positionList.join(', ')} !important`,
    `background-attachment: var(--charpente-shine-attachment, scroll), ${layers.map(() => 'scroll').join(', ')} !important`,
    ...(type === 'text'
      ? ['background-clip: content-box !important', 'background-origin: content-box !important']
      : []),
  ]
}

export const paintRule = (type: PaintType, paint: Paint, scopes: string[], selector = TYPE_SELECTORS[type]): string => {
  const body = [...fillDeclarations(type, paint), declarations(paint.style)].filter(Boolean).join(';\n  ')
  return `${within(scopes, selector)} {\n  ${body};\n}`
}
