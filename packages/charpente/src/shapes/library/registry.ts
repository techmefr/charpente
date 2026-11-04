import type { ShapeDef } from '../../types'
import { avatar, bubble, card, gift, giftSnow, label } from './named'

export const builtinShapes: Record<string, ShapeDef> = { gift, 'gift-snow': giftSnow, card, avatar, label, bubble }
