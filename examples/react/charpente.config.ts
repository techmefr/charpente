import { defineCharpente } from 'charpente'

export default defineCharpente({
  theme: 'outline',
  motion: 'pulse',
  timing: { delay: 100, stagger: 60 },
  themes: {
    brand: {
      extends: 'solid',
      tokens: { base: '#fde68a', shine: 'rgba(255, 255, 255, 0.85)' },
    },
  },
})
