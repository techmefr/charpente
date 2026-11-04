import type { ShapeDef } from '../../types'
import { avatar, bubble, card, gift, giftWrap, giftWrapBand, label } from './named'

export const builtinShapes: Record<string, ShapeDef> = {
  gift,
  'gift-wrap': giftWrap,
  'gift-wrap-band': giftWrapBand,
  card,
  avatar,
  label,
  bubble,
}
