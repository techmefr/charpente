import type { ThemeDef } from '../../types'
import { brutalist } from './brutalist'
import { dots, outline, solid } from './core'
import { cyberpunk } from './cyberpunk'
import { developer } from './developer'
import { aurora, blueprint, halftone, neon } from './extras'
import { frost, glass, smoked } from './glass'
import { sketch } from './sketch'
import { topo } from './topo'
import { waves } from './waves'
import { web } from './web'

export const builtinThemes: Record<string, ThemeDef> = {
  solid, outline, dots, cyberpunk, web,
  blueprint, halftone, neon, aurora, brutalist, sketch, topo, waves,
  glass, frost, smoked,
  developer,
}
