import type { ThemeDef } from '../../types'
import { frost, glass, smoked } from './glass'
import { cyberpunk, dots, outline, solid, web } from './core'
import {
  aurora, blueprint, brutalist, halftone, neon, paper, scanline, sketch, stripes, topo, vegas, waves,
} from './extras'
import { analytics, commerce, developer, editorial, gaming, music, travel, wellness } from './usage'

export const builtinThemes: Record<string, ThemeDef> = {
  solid, outline, dots, cyberpunk, web,
  paper, blueprint, halftone, stripes, scanline, vegas, neon, aurora, brutalist, sketch, topo, waves,
  glass, frost, smoked,
  editorial, commerce, analytics, gaming, music, developer, travel, wellness,
}
