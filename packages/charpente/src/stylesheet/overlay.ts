import { declarations } from '../css'
import type { MotionDef } from '../types'

export const overlayKeyframes = (name: string, motion: MotionDef): string => {
  if (!motion.overlay) return ''
  const steps = Object.entries(motion.overlay.keyframes)
    .map(([step, decls]) => `${step} { ${declarations(decls)} }`)
    .join(' ')
  return `\n@keyframes charpente-${name}-overlay { ${steps} }`
}

export const overlayRules = (
  scopes: string[],
  names: string[],
  motions: Record<string, MotionDef>,
  speed: (duration: string) => string,
  delay: string,
): string[] => {
  const name = names.find((candidate) => motions[candidate]?.overlay)
  const overlay = name ? motions[name]?.overlay : undefined
  if (!name || !overlay) return []
  const pseudo = scopes.map((scope) => `${scope}::after`).join(',\n')
  const base = [
    "content: ''",
    'position: absolute',
    'inset: 0',
    'z-index: 1',
    'pointer-events: none',
    'border-radius: inherit',
    declarations(overlay.style),
  ].join(';\n  ')
  const animation = `animation: charpente-${name}-overlay ${speed(overlay.duration)} linear ${delay} infinite`
  return [
    `${scopes.join(',\n')} {\n  position: relative;\n}`,
    `${pseudo} {\n  ${base};\n}`,
    `@media (prefers-reduced-motion: no-preference) {\n  ${pseudo} {\n    ${animation};\n  }\n}`,
  ]
}
