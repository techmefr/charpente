import { declarations } from '../css'
import type { MotionDef } from '../types'
import { LOADING, allLeaves } from './selectors'

const MAX_COMBINED_MOTIONS = 6

export const keyframesCss = (name: string, motion: MotionDef): string => {
  const steps = Object.entries(motion.keyframes)
    .map(([step, decls]) => `${step} { ${declarations(decls)} }`)
    .join(' ')
  return `@keyframes charpente-${name} { ${steps} }`
}

const subsets = (names: string[]): string[][] => {
  if (names.length > MAX_COMBINED_MOTIONS) return names.map((name) => [name])
  const result: string[][] = []
  for (let mask = 1; mask < 1 << names.length; mask++) {
    result.push(names.filter((_, index) => mask & (1 << index)))
  }
  return result
}

const motionScopes = (names: string[], allNames: string[]): string[] => {
  const exact = `${LOADING}[data-charpente-motion="${names.join(' ')}"]`
  if (allNames.length > MAX_COMBINED_MOTIONS) return [exact]
  const has = names.map((name) => `[data-charpente-motion~="${name}"]`)
  const lacks = allNames
    .filter((name) => !names.includes(name))
    .map((name) => `:not([data-charpente-motion~="${name}"])`)
  return [exact, `${LOADING}${has.join('')}${lacks.join('')}`]
}

const conflictWarnings = (motions: Record<string, MotionDef>, defaultNames: string[]): string[] => {
  const warnings: string[] = []
  const seen = new Map<string, string>()
  for (const name of defaultNames) {
    for (const decls of Object.values((motions[name] as MotionDef).keyframes)) {
      for (const property of Object.keys(decls)) {
        if (property.startsWith('--')) continue
        const owner = seen.get(property)
        if (owner && owner !== name) {
          warnings.push(`charpente: motions "${owner}" and "${name}" both animate "${property}", the later one wins`)
        }
        seen.set(property, name)
      }
    }
  }
  return warnings
}

export const motionCss = (
  motions: Record<string, MotionDef>,
  defaultNames: string[],
  delay: number,
  stagger: number,
  warnings: string[],
): string => {
  const delayVar = `var(--charpente-delay, ${delay}ms)`
  const staggerDelay = `calc(${delayVar} + var(--charpente-i, 0) * var(--charpente-stagger, ${stagger}ms))`
  const reveal = `charpente-reveal 0s linear ${staggerDelay} both`

  const rule = (scopes: string[], names: string[]): string => {
    const animations = [
      reveal,
      ...names.map((name) => {
        const motion = motions[name] as MotionDef
        return `charpente-${name} ${motion.duration} ${motion.easing ?? 'ease-in-out'} ${staggerDelay} ${motion.iterations ?? 'infinite'}`
      }),
    ]
    const layer = names.map((name) => motions[name]?.layer).find(Boolean)
    const body = [`animation: ${animations.join(', ')}`]
    if (layer) body.push(`--charpente-shine-layer: ${layer}`)
    const attachment = names.map((name) => motions[name]?.attachment).find(Boolean)
    if (attachment) body.push(`--charpente-shine-attachment: ${attachment}`)
    return `${scopes.map(allLeaves).join(',\n')} {\n  ${body.join(';\n  ')};\n}`
  }

  warnings.push(...conflictWarnings(motions, defaultNames))
  const allNames = Object.keys(motions).sort()
  const rules = [
    rule([`${LOADING}:not([data-charpente-motion])`], defaultNames),
    rule([`${LOADING}[data-charpente-motion="none"]`], []),
    ...subsets(allNames).map((names) => rule(motionScopes(names, allNames), names)),
  ]
  return rules.join('\n')
}
