import { defineCharpente } from 'charpente'

export default defineCharpente({
  themesDir: '../recipes',
  defaultTheme: 'solid',
  timeZone: 'Europe/Paris',
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
    grille: {
      colors: ['#dbeafe', '#93c5fd'],
      pattern: {
        fill: 'linear-gradient(var(--charpente-strong) 1px, transparent 1px), linear-gradient(90deg, var(--charpente-strong) 1px, transparent 1px), linear-gradient(var(--charpente-base), var(--charpente-base))',
        size: (step) => `${8 * step}px ${8 * step}px, ${8 * step}px ${8 * step}px, auto`,
      },
      radius: (step) => `${2 * step}px`,
      style: { boxShadow: 'inset 0 0 0 1px #93c5fd' },
      paint: { text: { style: { borderRadius: '1px' } } },
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
    survol: {
      extends: 'solid',
      hover: 'accent',
    },
    'survol-fin': {
      extends: 'brume',
      hover: {
        text: { fill: 'linear-gradient(var(--charpente-accent), var(--charpente-accent))', radius: '999px' },
        media: { border: '3px solid var(--charpente-accent)' },
        control: { style: { opacity: '0.6' } },
        block: { fill: 'linear-gradient(var(--charpente-accent2), var(--charpente-accent2))' },
      },
      hoverMotion: 'pause',
    },
  },
  motions: {
    rebond: {
      duration: '1.2s',
      keyframes: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-3px)' },
      },
    },
  },
})
