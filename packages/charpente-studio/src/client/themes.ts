import * as themes from 'charpente/themes'
import { themesOf } from '../generator/share'

;(globalThis as unknown as { charpenteThemes: unknown }).charpenteThemes = themesOf(themes)
