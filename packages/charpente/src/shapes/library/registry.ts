import type { ShapeDef } from '../../types'
import { avatar, bubble, card, frostCard, frostChip, gift, giftWrap, giftWrapBand, label } from './named'

export const builtinShapes: Record<string, ShapeDef> = {
  gift,
  'gift-wrap': giftWrap,
  'gift-wrap-band': giftWrapBand,
  'frost-card': frostCard,
  'frost-chip': frostChip,
  card,
  avatar,
  label,
  bubble,
}
