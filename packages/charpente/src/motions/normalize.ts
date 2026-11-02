import type { MotionDef } from '../types'

export const normalizeMotion = (
  motion: string | string[],
  motions: Record<string, MotionDef>,
): string[] => {
  const names = (Array.isArray(motion) ? motion : [motion]).filter((name) => name !== 'none')
  for (const name of names) {
    if (!motions[name]) throw new Error(`charpente: unknown motion "${name}"`)
  }
  return [...new Set(names)].sort()
}
