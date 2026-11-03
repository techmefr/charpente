import type { ThemeDef } from '../../types'
import { brutalist } from './brutalist'
import { dots, outline, solid } from './core'
import { cyberpunk } from './cyberpunk'
import { developer } from './developer'
import { aurora, blueprint, halftone, neon, stripes, waves } from './extras'
import { frost, glass, smoked } from './glass'
import { music } from './music'
import { sketch } from './sketch'
import { topo } from './topo'
import { wellness } from './usage'
import { web } from './web'

export const builtinThemes: Record<string, ThemeDef> = {
  solid, outline, dots, cyberpunk, web,
  blueprint, halftone, stripes, neon, aurora, brutalist, sketch, topo, waves,
  glass, frost, smoked,
  music, developer, wellness,
}
