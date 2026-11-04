import type { Declarations } from 'charpente/lite'
import { TOKENS, tokenOf, type BorderKind, type BorderState } from './state'

const SOLID_KINDS: BorderKind[] = ['solid', 'dashed', 'dotted', 'double', 'groove']
const DIAGONAL = /^repeating-linear-gradient\(45deg, (.+) 0 6px, transparent 6px 12px\) 1$/
const SHORTHAND = /^(\d+)px (solid|dashed|dotted|double|groove) (.+)$/
const OUTLINE = /^(\d+)px solid (.+)$/
const INSET = /^inset 0 0 0 (\d+)px (.+)$/

export const colorValue = (color: string): string => (TOKENS.some((token) => token === color) ? `var(--charpente-${color})` : color)

export const borderDeclarations = ({ kind, width, color }: BorderState): Declarations => {
  const value = colorValue(color)
  if (kind === 'inherit') return {}
  if (kind === 'none') return { border: 'none' }
  if (SOLID_KINDS.includes(kind)) return { border: `${width}px ${kind} ${value}` }
  if (kind === 'outline') return { outline: `${width}px solid ${value}`, outlineOffset: '2px' }
  if (kind === 'inset') return { boxShadow: `inset 0 0 0 ${width}px ${value}` }
  return {
    boxSizing: 'border-box',
    borderStyle: 'solid',
    borderWidth: `${width}px`,
    borderImage: `repeating-linear-gradient(45deg, ${value} 0 6px, transparent 6px 12px) 1`,
  }
}

export const BORDER_KEYS = ['border', 'outline', 'outlineOffset', 'boxShadow', 'boxSizing', 'borderStyle', 'borderWidth', 'borderImage']

export const parseBorder = (style: Declarations): BorderState | undefined => {
  const border = style.border
  if (border === 'none') return { kind: 'none', width: 2, color: 'strong' }
  const flat = border ? SHORTHAND.exec(border) : null
  if (flat) return { kind: flat[2] as BorderKind, width: Number(flat[1]), color: tokenOf(flat[3] as string) }
  const outline = style.outline ? OUTLINE.exec(style.outline) : null
  if (outline) return { kind: 'outline', width: Number(outline[1]), color: tokenOf(outline[2] as string) }
  const inset = style.boxShadow ? INSET.exec(style.boxShadow) : null
  if (inset) return { kind: 'inset', width: Number(inset[1]), color: tokenOf(inset[2] as string) }
  const diagonal = style.borderImage ? DIAGONAL.exec(style.borderImage) : null
  if (diagonal) return { kind: 'diagonal', width: Number.parseInt(style.borderWidth ?? '2', 10), color: tokenOf(diagonal[1] as string) }
  return undefined
}
