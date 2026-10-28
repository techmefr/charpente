import type { MotionDef } from './types'

export const builtinMotions: Record<string, MotionDef> = {
  shimmer: {
    duration: '1.6s',
    easing: 'linear',
    layer:
      'linear-gradient(100deg, transparent 20%, var(--charpente-shine) 50%, transparent 80%)',
    keyframes: {
      from: { '--charpente-shine-x': '-80%' },
      to: { '--charpente-shine-x': '180%' },
    },
  },
  pulse: {
    duration: '1.4s',
    keyframes: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
  },
  wave: {
    duration: '1.4s',
    staggered: true,
    keyframes: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.45' },
    },
  },
  glitch: {
    duration: '2.6s',
    easing: 'steps(1, end)',
    keyframes: {
      '0%, 90%, 100%': { transform: 'none' },
      '92%': { transform: 'translate(-2px, 1px)' },
      '94%': { transform: 'translate(2px, -1px)' },
      '96%': { transform: 'translate(-1px, 0)' },
    },
  },
}
