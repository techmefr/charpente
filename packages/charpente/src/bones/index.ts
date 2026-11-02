import type { BonesData, ZoneBones } from '../types'
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

const zoneRule = (name: string, zone: ZoneBones): string => {
  const mask = maskUrl(zone)
  return [
    `${LOADING} [data-charpente-capture="${name}"] {`,
    `  min-height: ${Math.round(zone.height)}px;`,
    `  -webkit-mask: ${mask} 0 0 / 100% 100% no-repeat;`,
    `  mask: ${mask} 0 0 / 100% 100% no-repeat;`,
    `}`,
  ].join('\n')
}

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
