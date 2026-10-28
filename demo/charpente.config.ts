import { defineCharpente } from 'charpente'

export default defineCharpente({
  defaultTheme: 'solid',
  motion: 'shimmer',
  timing: { delay: 120, stagger: 40 },
  colorScheme: { dark: '[data-theme="dark"]' },
  themes: {
    mint: {
      extends: 'solid',
      tokens: { base: '#d1fae5', shine: 'rgba(255, 255, 255, 0.8)' },
    },
  },
})
