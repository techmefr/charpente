import type { MotionDef } from '../types'

const HALO = 'color-mix(in srgb, var(--charpente-accent, #38bdf8) 30%, transparent)'
const CORE = 'color-mix(in srgb, var(--charpente-accent2, #ffffff) 45%, #ffffff)'

const BAND = ['transparent 32%', `${HALO} 43%`, `${CORE} 49.3%`, `${CORE} 50.7%`, `${HALO} 57%`, 'transparent 68%'].join(', ')

export const beamMotions: Record<string, MotionDef> = {
  beam: {
    duration: '2.2s',
    ambient: true,
    easing: 'ease-in-out',
    layer: `linear-gradient(115deg, ${BAND})`,
    keyframes: {
      from: { '--charpente-shine-x': '-90%' },
      to: { '--charpente-shine-x': '190%' },
    },
  },
  'border-beam': {
    duration: '3.2s',
    ambient: true,
    easing: 'linear',
    trace: 'border',
    keyframes: {
      from: { '--charpente-beam-angle': '0deg' },
      to: { '--charpente-beam-angle': '360deg' },
    },
  },
  'border-beam-line': {
    duration: '2.8s',
    ambient: true,
    easing: 'ease-in-out',
    trace: 'line',
    keyframes: {
      '0%, 100%': { '--charpente-beam-x': '0%' },
      '50%': { '--charpente-beam-x': '100%' },
    },
  },
}
