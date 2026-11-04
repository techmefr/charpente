import type { ThemeDef } from 'charpente'
import { paperPaint } from './papers'

export default {
  tokens: { base: '#c99a63', strong: '#a87a45', accent: '#b3202b' },
  dark: { base: '#7a5a36', strong: '#5d4326', accent: '#d03a46', shine: 'rgba(255,255,255,0.16)' },
  motion: 'snow',
  paint: paperPaint('kraft', false),
  variants: {
    green: {
      tokens: { base: '#1f5a34', strong: '#143d24', accent: '#d4a63a' },
      dark: { base: '#143d24', strong: '#0b2616', accent: '#e0b44a' },
      paint: paperPaint('green', true),
    },
    cream: {
      tokens: { base: '#f0e3c8', strong: '#d8c8a4', accent: '#b3202b' },
      dark: { base: '#6b6450', strong: '#4e4838', accent: '#d03a46' },
      paint: paperPaint('cream', false),
    },
    red: {
      tokens: { base: '#a01f2a', strong: '#751219', accent: '#d4a63a' },
      dark: { base: '#6b141c', strong: '#470c12', accent: '#e0b44a' },
      paint: paperPaint('red', true),
    },
    'kraft-green': {
      tokens: { base: '#c99a63', strong: '#a87a45', accent: '#1f6b3a' },
      dark: { base: '#7a5a36', strong: '#5d4326', accent: '#2f8a4f' },
      paint: paperPaint('kraft-green', true),
    },
  },
} satisfies ThemeDef
