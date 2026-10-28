import { defineCharpente } from 'charpente'

export default defineCharpente({
  defaultTheme: 'solid',
  timeZone: 'Europe/Paris',
  motion: 'shimmer',
  timing: { delay: 120, stagger: 60 },
  colorScheme: { dark: '[data-theme="dark"]' },
  schedule: [
    { theme: 'winter', from: '01-01', to: '02-15' },
    { theme: 'spring', from: '03-20', to: '05-31' },
    { theme: 'summer', from: '07-01', to: '08-31' },
    { theme: 'autumn', from: '09-22', to: '10-23' },
    { theme: 'halloween', from: '10-24', to: '11-02' },
    { theme: 'christmas', from: '12-15', to: '12-31' },
  ],
  themes: {
    brume: {
      extends: 'solid',
      tokens: {
        base: 'rgba(96, 165, 250, 0.3)',
        strong: 'rgba(59, 130, 246, 0.55)',
        shine: 'rgba(255, 255, 255, 0.6)',
      },
    },
    'brume-ronde': {
      extends: 'brume',
      paint: {
        media: { style: { borderRadius: '50%' } },
        control: { style: { borderRadius: '999px' } },
        block: {
          fill: 'repeating-linear-gradient(45deg, var(--charpente-base) 0 10px, var(--charpente-strong) 10px 20px)',
        },
      },
    },
  },
  motions: {
    rebond: {
      duration: '1.2s',
      staggered: true,
      keyframes: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-3px)' },
      },
    },
  },
})
