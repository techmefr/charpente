import { flat } from '../css'
import { PAINT_TYPES, type HoverDef, type HoverPaint, type Paint, type PaintType, type TokenName } from '../types'
import { borderDeclarations } from './short-format'

const TOKEN_NAMES: TokenName[] = ['base', 'strong', 'shine', 'accent', 'accent2']

const shortFill = (value: string): string =>
  flat(TOKEN_NAMES.includes(value as TokenName) ? `var(--charpente-${value})` : value)

const expandPaint = ({ radius, border, style, ...paint }: HoverPaint): Paint => ({
  ...paint,
  style: {
    ...(radius && { borderRadius: radius }),
    ...(border && borderDeclarations(border)),
    ...style,
  },
})

export const expandHover = (hover: HoverDef | undefined): Partial<Record<PaintType, Paint>> => {
  if (hover === undefined) return {}
  if (typeof hover === 'string') {
    return Object.fromEntries(PAINT_TYPES.map((type) => [type, { fill: shortFill(hover) }]))
  }
  return Object.fromEntries(
    PAINT_TYPES.filter((type) => hover[type]).map((type) => [type, expandPaint(hover[type] as HoverPaint)]),
  )
}
