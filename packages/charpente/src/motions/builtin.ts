import type { MotionDef } from '../types'

const split = (x: number, y: number): string =>
  `drop-shadow(${x}px ${y}px 0 var(--charpente-${x < 0 ? 'accent2' : 'accent'}, ${x < 0 ? '#22d3ee' : '#ec4899'}))`

const flow = (duration: string): MotionDef => ({
  duration,
  easing: 'linear',
  ambient: true,
  keyframes: { from: { '--charpente-flow': '0' }, to: { '--charpente-flow': '1' } },
})

export const builtinMotions: Record<string, MotionDef> = {
  waves: flow('10s'),
  matrix: flow('6s'),
  snow: flow('18s'),
  petals: flow('16s'),
  leaves: flow('17s'),
  sparkle: flow('12s'),
  shimmer: {
    duration: '1.8s',
    easing: 'ease-in-out',
    layer:
      'linear-gradient(100deg, transparent 20%, var(--charpente-shine) 50%, transparent 80%)',
    keyframes: {
      from: { '--charpente-shine-x': '-80%' },
      to: { '--charpente-shine-x': '180%' },
    },
  },
  sweep: {
    duration: '2.4s',
    easing: 'ease-in-out',
    attachment: 'fixed',
    layer:
      'linear-gradient(100deg, transparent 20%, var(--charpente-shine) 50%, transparent 80%)',
    keyframes: {
      from: { '--charpente-shine-x': '-250%' },
      to: { '--charpente-shine-x': '350%' },
    },
  },
  pulse: {
    duration: '1.6s',
    easing: 'ease-in-out',
    keyframes: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
  },
  glitch: {
    duration: '3.4s',
    easing: 'steps(1, end)',
    keyframes: {
      '0%, 86%, 100%': { transform: 'none' },
      '87%': { transform: 'translate(-3px, 1px)' },
      '89%': { transform: 'translate(3px, -1px)' },
      '91%': { transform: 'translate(-2px, 0)' },
      '93%': { transform: 'translate(1px, 0)' },
    },
    container: {
      '0%, 86%, 94%, 100%': { filter: 'none' },
      '87%': { filter: `${split(-6, 0)} ${split(6, 0)}` },
      '89%': { filter: `${split(5, -1)} ${split(-5, 1)}` },
      '91%': { filter: `${split(-3, 0)} ${split(3, 0)}` },
      '93%': { filter: `${split(2, 0)} ${split(-2, 0)}` },
    },
  },
}
