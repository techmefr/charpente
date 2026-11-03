import { declarations } from '../css'
import { PAINT_TYPES, type HoverMotion, type Paint, type PaintType } from '../types'
import { fillDeclarations } from './paint'
import { leavesOf, withinAll } from './selectors'

const FAST_DURATIONS = `0s, ${Array(6).fill('var(--charpente-hover-fast, 600ms)').join(', ')}`
const TRANSITIONED = 'border-radius, border-color, border-width, opacity, filter, transform, box-shadow, background-color, outline-color'

const motionDeclarations = (motion: HoverMotion): string[] => {
  if (motion === 'pause') return ['animation-play-state: paused']
  if (motion === 'faster') return [`animation-duration: ${FAST_DURATIONS}`]
  return []
}

const hoverBody = (type: PaintType, paint: Paint | undefined, motion: HoverMotion): string =>
  [
    ...(paint?.fill ? fillDeclarations(type, paint) : []),
    declarations(paint?.style),
    ...motionDeclarations(motion),
  ]
    .filter(Boolean)
    .join(';\n  ')

export const hoverCss = (
  scopes: string[],
  hover: Partial<Record<PaintType, Paint>>,
  motion: HoverMotion,
  captured: boolean,
): string => {
  const types = PAINT_TYPES.filter((type) => hover[type] || motion !== 'none')
  if (types.length === 0) return ''
  const resting = withinAll(scopes, types.flatMap((type) => leavesOf(type, captured)))
  const rules = types.map(
    (type) => `${withinAll(scopes, leavesOf(type, captured, true))} {\n  ${hoverBody(type, hover[type], motion)};\n}`,
  )
  return [
    `@media (hover: hover) {\n${resting} {\n  pointer-events: auto;\n}\n${rules.join('\n')}\n}`,
    `@media (hover: hover) and (prefers-reduced-motion: no-preference) {\n${resting} {\n  transition-property: ${TRANSITIONED};\n  transition-duration: var(--charpente-hover-ms, 150ms);\n}\n}`,
  ].join('\n')
}
