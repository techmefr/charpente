import type { ThemeDef } from 'charpente'
import { frostPaint } from './frost'

export default {
  tokens: { base: '#a9bcd3', strong: '#8aa0ba', accent: '#e6f3fc', accent2: '#f4f9fe' },
  dark: { base: '#2c3d54', strong: '#1d2a3c', accent: '#b9d3ea', accent2: '#dbe8f4', shine: 'rgba(255,255,255,0.16)' },
  motion: 'snow',
  paint: frostPaint(),
} satisfies ThemeDef
