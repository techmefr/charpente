import { defineCharpente } from 'charpente'

export default defineCharpente({
  theme: 'cyberpunk',
  motion: ['shimmer', 'glitch'],
  timing: { delay: 150, stagger: 50 },
  colorScheme: { dark: '.dark' },
})
