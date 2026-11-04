import type { ShapeDef } from '../../types'
import { avatar, bubble, card, gift, giftSnow, giftSnowButton, giftSnowFill, giftSnowLine, label } from './named'

export const builtinShapes: Record<string, ShapeDef> = {
  gift,
  'gift-snow': giftSnow,
  'gift-snow-fill': giftSnowFill,
  'gift-snow-button': giftSnowButton,
  'gift-snow-line': giftSnowLine,
  card,
  avatar,
  label,
  bubble,
}
