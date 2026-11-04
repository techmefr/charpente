import type { MotionDef, PaintType } from '../types'
import { TYPE_SELECTORS } from './selectors'

const TRACED: PaintType[] = ['block', 'control']
const WIDTH = 'var(--charpente-beam-width, 2px)'
const GLOW = 'var(--charpente-beam-glow, 6px)'
const SIZE = 'var(--charpente-beam-size, 70deg)'
const LENGTH = 'var(--charpente-beam-size, 40%)'
const FILL = 'linear-gradient(#000 0 0)'

const ACCENT = 'var(--charpente-accent, #38bdf8)'
const CORE = 'var(--charpente-accent2, #e879f9)'
const mix = (percent: number): string => `color-mix(in srgb, ${ACCENT} ${percent}%, transparent)`

const stop = (color: string, share: number, size: string): string => `${color} calc(${size} * ${share})`

const conic = (size: string, strength: number): string =>
  `conic-gradient(from var(--charpente-beam-angle), transparent 0deg, ${[
    stop(mix(strength * 0.25), 0.4, size),
    stop(mix(strength * 0.6), 0.7, size),
    stop(mix(strength), 0.88, size),
    stop(strength === 100 ? CORE : mix(strength), 0.96, size),
    `transparent ${size}`,
  ].join(', ')}, transparent 360deg)`

const stripe = `linear-gradient(90deg, transparent, ${mix(70)} 25%, ${CORE} 50%, ${mix(70)} 75%, transparent)`

const slotSelectors = (scopes: string[], pseudo: string, captured: boolean): string => {
  const apart = captured ? ':not([data-charpente-capture])' : ''
  return scopes.flatMap((scope) => TRACED.map((type) => `${scope} ${TYPE_SELECTORS[type]}${apart}${pseudo}`)).join(',\n')
}

const capturedSelectors = (scopes: string[]): string =>
  scopes.map((scope) => `${scope} [data-charpente-capture][data-charpente-capture][data-charpente-capture]::after`).join(',\n')

const block = (selector: string, lines: string[]): string => `${selector} {\n  ${lines.join(';\n  ')};\n}`

const reaches = ['content: \'\'', 'position: absolute', 'inset: 0', 'box-sizing: border-box', 'pointer-events: none', 'z-index: 1']

const ring = (width: string, background: string): string[] => [
  ...reaches,
  `border: ${width} solid transparent`,
  'border-radius: inherit',
  `background: ${background}`,
  'background-origin: border-box',
  'background-clip: border-box',
  `mask-image: var(--charpente-shape-mask, ${FILL}), var(--charpente-shape-mask, ${FILL})`,
  'mask-size: var(--charpente-shape-fit, auto), var(--charpente-shape-fit, auto)',
  'mask-repeat: no-repeat',
  'mask-position: center',
  'mask-origin: border-box, padding-box',
  'mask-clip: border-box, padding-box',
  'mask-composite: exclude',
  '-webkit-mask-composite: xor',
]

const line = (): string[] => [
  'content: \'\'',
  'position: absolute',
  'left: calc(var(--charpente-radius, 12px) * 0.6)',
  'right: calc(var(--charpente-radius, 12px) * 0.6)',
  'bottom: 0',
  `height: ${WIDTH}`,
  'pointer-events: none',
  'z-index: 1',
  `background: ${stripe} no-repeat`,
  `background-size: ${LENGTH} 100%`,
  'background-position: var(--charpente-beam-x) 0',
  `filter: drop-shadow(0 0 ${GLOW} ${ACCENT})`,
]

const capturedRing = (): string[] => [
  ...reaches,
  `background-image: ${conic(`calc(${SIZE} * 2.2)`, 100)} !important`,
  'background-color: transparent !important',
  'background-size: auto !important',
  'background-position: 0 0 !important',
  'background-repeat: no-repeat !important',
  'background-attachment: scroll !important',
  'background-origin: border-box',
  'mask-image: var(--charpente-ring-mask, linear-gradient(transparent, transparent))',
  'mask-size: 100% 100%',
  'mask-repeat: no-repeat',
]

const capturedLine = (): string[] => [
  ...reaches,
  `filter: drop-shadow(0 0 ${GLOW} ${ACCENT})`,
  `background-image: ${stripe} !important`,
  'background-color: transparent !important',
  'background-repeat: no-repeat !important',
  `background-size: ${LENGTH} 100% !important`,
  'background-position: var(--charpente-beam-x) 0 !important',
  'background-attachment: scroll !important',
  'mask-image: var(--charpente-ring-mask, linear-gradient(transparent, transparent)), linear-gradient(transparent 82%, #000 96%)',
  'mask-size: 100% 100%',
  'mask-repeat: no-repeat',
  'mask-composite: intersect',
  '-webkit-mask-composite: source-in',
]

const anchor = (selector: string): string => block(selector, ['position: relative'])

export const traceRules = (
  scopes: string[],
  names: string[],
  motions: Record<string, MotionDef>,
  captured: boolean,
): string[] => {
  const kind = names.map((name) => motions[name]?.trace).find(Boolean)
  if (!kind) return []
  const leaves = slotSelectors(scopes, '', captured)
  const zones = captured ? capturedSelectors(scopes).replace(/::after/g, '') : ''
  const parts = kind === 'border'
    ? [
        anchor(leaves),
        block(slotSelectors(scopes, '::before', captured), ring(`calc(${WIDTH} + ${GLOW} * 0.6)`, conic(`calc(${SIZE} * 1.3)`, 55))),
        block(slotSelectors(scopes, '::after', captured), ring(WIDTH, conic(SIZE, 100))),
      ]
    : [anchor(leaves), block(slotSelectors(scopes, '::after', captured), line())]
  if (!captured) return parts
  const extra = kind === 'border' ? capturedRing() : capturedLine()
  return [...parts, anchor(zones), block(capturedSelectors(scopes), extra)]
}
