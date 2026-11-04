import type { ShapeDef, ShapeRole } from 'charpente/lite'
import { avatar, bubble, card, frostCard, frostChip, gift, giftWrap, giftWrapBand, label } from 'charpente/shapes'

export const SHAPE_LIBRARY: Record<string, ShapeDef> = { gift, 'gift-wrap': giftWrap, 'gift-wrap-band': giftWrapBand, 'frost-card': frostCard, 'frost-chip': frostChip, card, avatar, label, bubble }
export const SHAPE_TITLES: Record<string, string> = { gift: 'Gift', 'gift-wrap': 'Wrapped gift', 'gift-wrap-band': 'Ribbon band', 'frost-card': 'Frosted card', 'frost-chip': 'Frosted chip', card: 'Organic card', avatar: 'Avatar blob', label: 'Label', bubble: 'Speech bubble' }
export const ROLES: readonly ShapeRole[] = ['body', 'accent', 'accent2', 'detail', 'shine']
export const ROLE_TITLES: Record<ShapeRole, string> = { body: 'Theme paint', accent: 'Accent', accent2: 'Accent 2', detail: 'Shade', shine: 'Shine' }

export const defaultRoles = (name: string): ShapeRole[] => (SHAPE_LIBRARY[name]?.layers ?? []).map((layer) => layer.role)

export const customRoles = (name: string, roles: readonly ShapeRole[]): boolean => {
  const defaults = defaultRoles(name)
  return roles.length === defaults.length && roles.some((role, index) => role !== defaults[index])
}

export const shapeValue = (name: string, roles: readonly ShapeRole[]): string | ShapeDef | undefined => {
  const base = SHAPE_LIBRARY[name]
  if (!base) return undefined
  if (!customRoles(name, roles)) return name
  return { ...base, layers: base.layers.map((layer, index) => ({ ...layer, role: roles[index] as ShapeRole })) }
}

export const shapeState = (value: string | ShapeDef): { shape: string; roles: ShapeRole[] } | undefined => {
  if (typeof value === 'string') return SHAPE_LIBRARY[value] ? { shape: value, roles: [] } : undefined
  const paths = JSON.stringify(value.layers.map((layer) => layer.path))
  const name = Object.keys(SHAPE_LIBRARY).find((key) => JSON.stringify(SHAPE_LIBRARY[key]?.layers.map((layer) => layer.path)) === paths)
  if (!name) return undefined
  const roles = value.layers.map((layer) => layer.role)
  return { shape: name, roles: customRoles(name, roles) ? roles : [] }
}
