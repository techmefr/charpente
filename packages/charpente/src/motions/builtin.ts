import type { MotionDef } from '../types'

const split = (x: number, y: number): string =>
  `drop-shadow(${x}px ${y}px 0 var(--charpente-${x < 0 ? 'accent2' : 'accent'}, ${x < 0 ? '#22d3ee' : '#ec4899'}))`

const MASK = 'var(--charpente-crt-mask, 0.05)'
const GLOW = 'drop-shadow(0 0 4px var(--charpente-accent, #4ade80))'
const flicker = (opacity: string): Record<string, string> => ({ opacity })
const rgb = (alpha: string): string =>
  `repeating-linear-gradient(90deg, rgba(255,0,0,${alpha}) 0 1px, rgba(0,255,0,${alpha}) 1px 2px, rgba(0,0,255,${alpha}) 2px 3px)`

export const builtinMotions: Record<string, MotionDef> = {
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
  crt: {
    duration: '5s',
    easing: 'linear',
    keyframes: {
      '0%, 100%': { opacity: '1', filter: GLOW },
      '50%': { opacity: '0.9', filter: GLOW },
    },
    container: {
      '0%, 100%': flicker('1'),
      '17%': flicker('1'),
      '17.5%': flicker('0.93'),
      '18%': flicker('1'),
      '52%': flicker('1'),
      '52.4%': flicker('0.95'),
      '52.8%': flicker('0.98'),
      '53.2%': flicker('1'),
      '81%': flicker('1'),
      '81.4%': flicker('0.94'),
      '82%': flicker('1'),
    },
    overlay: {
      duration: '7s',
      style: {
        backgroundImage: [
          'linear-gradient(transparent, rgba(255,255,255,0.07), transparent)',
          'linear-gradient(rgba(0,0,0,0.2) 33%, transparent 33%)',
          rgb(MASK),
          'radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,var(--charpente-crt-vignette, 0.38)) 100%)',
        ].join(', '),
        backgroundSize: '100% 28%, 100% 3px, auto, auto',
        backgroundRepeat: 'no-repeat, repeat, repeat, no-repeat',
        backgroundPosition: '0 -30%, 0 0, 0 0, 0 0',
      },
      keyframes: {
        from: { backgroundPosition: '0 -30%, 0 0, 0 0, 0 0' },
        to: { backgroundPosition: '0 130%, 0 21px, 0 0, 0 0' },
      },
    },
  },
}
