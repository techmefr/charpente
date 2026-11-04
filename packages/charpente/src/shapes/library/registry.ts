import type { ShapeDef } from '../../types'
import { avatar, bubble, card, frostCard, frostChip, gift, giftWrap, giftWrapBand, label, snowCapCard, snowCapChip } from './named'

export const builtinShapes: Record<string, ShapeDef> = {
  gift,
  'gift-wrap': giftWrap,
  'gift-wrap-band': giftWrapBand,
  'frost-card': frostCard,
  'frost-chip': frostChip,
  'snow-cap': snowCapCard,
  'snow-cap-chip': snowCapChip,
  card,
  avatar,
  label,
  bubble,
}
