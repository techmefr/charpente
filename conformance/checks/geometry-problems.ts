import type { Page } from 'playwright'
import { GEOMETRY_TOLERANCE, ROOT } from './settings.ts'

export const snapshot = (page: Page): Promise<number[][]> =>
  page.$$eval(`${ROOT}, ${ROOT} *`, (elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect()
      return [rect.x, rect.y, rect.width, rect.height]
    }),
  )

export const geometryProblems = (loaded: number[][], loading: number[][]): string[] => {
  if (loaded.length !== loading.length) {
    return [`element count differs: ${loaded.length} loaded, ${loading.length} loading`]
  }
  const problems: string[] = []
  loaded.forEach((box, index) => {
    const other = loading[index] as number[]
    const moved = box.some((value, axis) => Math.abs(value - (other[axis] as number)) > GEOMETRY_TOLERANCE)
    if (moved) problems.push(`box #${index} moved from [${box.map(Math.round)}] to [${other.map(Math.round)}]`)
  })
  return problems
}
