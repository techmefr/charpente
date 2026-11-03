import type { BonesData, PaintType, ZoneBones } from '../types'
import { maskUrl } from './mask'

const LOADING = '[data-charpente-loading]'

const ranges = (breakpoints: number[]): { from: number; to: number | undefined; breakpoint: number }[] =>
  breakpoints.map((breakpoint, index) => ({
    breakpoint,
    from: index === 0 ? 0 : breakpoint,
    to: breakpoints[index + 1],
  }))

const mediaQuery = (from: number, to: number | undefined): string => {
  const min = from > 0 ? `(min-width: ${from}px)` : ''
  const max = to === undefined ? '' : `(max-width: ${to - 1}px)`
  return [min, max].filter(Boolean).join(' and ')
}

const SOLID: PaintType[] = ['block', 'control']
const LAYERED: PaintType[] = ['text', 'media']

const SLOTS: { pseudo: string; kinds: PaintType[] }[] = [
  { pseudo: '', kinds: SOLID },
  { pseudo: '::before', kinds: ['text'] },
  { pseudo: '::after', kinds: ['media'] },
]

const has = (zone: ZoneBones, kinds: PaintType[]): boolean =>
  zone.bones.some((bone) => kinds.includes(bone.kind ?? 'block'))

const layer = (zone: ZoneBones, kinds: PaintType[]): string =>
  `${maskUrl({ ...zone, bones: zone.bones.filter((bone) => kinds.includes(bone.kind ?? 'block')) })} 0 0 / 100% 100% no-repeat`

const zoneMask = (zone: ZoneBones): string | undefined => {
  if (!has(zone, LAYERED)) return layer(zone, SOLID)
  return has(zone, SOLID) ? `${layer(zone, SOLID)}, ${layer(zone, LAYERED)}` : undefined
}

const maskDeclarations = (zone: ZoneBones, kinds: PaintType[], pseudo: string): string[] => {
  const mask = pseudo ? layer(zone, kinds) : zoneMask(zone)
  if (mask === undefined) return ['  background-image: none !important;', '  outline: none !important;']
  return [`  -webkit-mask: ${mask};`, `  mask: ${mask};`]
}

const slotRule = (name: string, zone: ZoneBones, { pseudo, kinds }: (typeof SLOTS)[number]): string => {
  const selector = `${pseudo ? LOADING : LOADING.repeat(3)} [data-charpente-capture="${name}"]${pseudo}`
  const head = pseudo
    ? ['  content: "";', '  position: absolute;', '  inset: 0;', '  pointer-events: none;']
    : [`  min-height: ${Math.round(zone.height)}px;`, ...(has(zone, LAYERED) ? ['  position: relative;'] : [])]
  return [`${selector} {`, ...head, ...maskDeclarations(zone, kinds, pseudo), `}`].join('\n')
}

const zoneRule = (name: string, zone: ZoneBones): string =>
  SLOTS.filter(({ pseudo, kinds }) => !pseudo || has(zone, kinds))
    .map((slot) => slotRule(name, zone, slot))
    .join('\n')

const zoneCss = (name: string, sets: Record<string, ZoneBones>): string => {
  const breakpoints = Object.keys(sets).map(Number).sort((a, b) => a - b)
  return ranges(breakpoints)
    .map(({ breakpoint, from, to }) => {
      const rule = zoneRule(name, sets[String(breakpoint)] as ZoneBones)
      const query = mediaQuery(from, to)
      return query ? `@media ${query} {\n${rule}\n}` : rule
    })
    .join('\n')
}

export const bonesCss = (data: BonesData): string =>
  Object.entries(data)
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([name, sets]) => zoneCss(name, sets))
    .join('\n')
