import { stateToTheme } from './build'
import { toLiteral } from './literal'
import type { GeneratorState } from './state'

export const themeSource = (state: GeneratorState): string =>
  ["import { defineTheme } from 'charpente'", '', `export default defineTheme(${toLiteral(stateToTheme(state))})`, ''].join('\n')

export const configSource = (state: GeneratorState): string => {
  const motion = state.motions.length === 0 ? 'none' : state.motions.length === 1 ? state.motions[0] : [...state.motions].sort()
  const config = {
    defaultTheme: state.name,
    motion,
    timing: { delay: state.delay, stagger: state.stagger },
  }
  return ["import { defineCharpente } from 'charpente'", '', `export default defineCharpente(${toLiteral(config)})`, ''].join('\n')
}

export const speedSource = (state: GeneratorState): string => `:root {\n  --charpente-speed: ${state.speed};\n}\n`

export const FILES = {
  theme: 'theme.ts',
  config: 'charpente.config.ts',
  speed: 'speed.css',
} as const
