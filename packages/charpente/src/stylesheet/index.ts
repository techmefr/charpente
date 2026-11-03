import { builtinMotions, normalizeMotion } from '../motions'
import { validateSchedule } from '../schedule'
import { assertAvailable, builtinThemes, resolveTheme, withVariants } from '../themes'
import type { CharpenteConfig, CompileResult, ThemeDef } from '../types'
import { bonesCss } from '../bones'
import { baseCss } from './base'
import { keyframesCss, motionCss } from './motion'
import { revealCss } from './reveal'
import { selectThemes } from './selection'
import { themeCss } from './theme'
import { tokensCss } from './tokens'

export const createCompiler =
  (registry: Record<string, ThemeDef>, onlyRegistry = false) =>
  (config: CharpenteConfig = {}): CompileResult => {
    const warnings: string[] = []
    const themes = withVariants({ ...registry, ...config.themes })
    if (onlyRegistry) {
      const named = [config.defaultTheme, ...(config.include ?? []), ...(config.schedule ?? []).map((entry) => entry.theme)]
      assertAvailable(named, themes)
    }
    const motions = { ...builtinMotions, ...config.motions }
    const defaultTheme = config.defaultTheme ?? 'solid'
    const defaultMotion = normalizeMotion(config.motion ?? 'shimmer', motions)
    const delay = config.timing?.delay ?? 120
    const stagger = config.timing?.stagger ?? 0

    resolveTheme(defaultTheme, themes)
    validateSchedule(config.schedule ?? [], Object.keys(themes), config.timeZone)

    const layered = [
      tokensCss(config),
      baseCss(),
      ...selectThemes(config, themes).map((name) =>
        themeCss(name, name === defaultTheme, themes, config.colorScheme, Boolean(config.bones)),
      ),
      motionCss(motions, defaultMotion, delay, stagger, warnings, Boolean(config.bones)),
      revealCss(config.reveal ?? 0),
      ...(config.bones ? [bonesCss(config.bones)] : []),
    ].join('\n')

    const css = [
      `@property --charpente-shine-x { syntax: '<percentage>'; inherits: false; initial-value: -80%; }`,
      `@keyframes charpente-reveal { from { visibility: hidden; } to { visibility: visible; } }`,
      `@keyframes charpente-reveal-in { from { opacity: 0; } to { opacity: 1; } }`,
      ...Object.entries(motions).map(([name, motion]) => keyframesCss(name, motion)),
      `@layer charpente {\n${layered}\n}`,
    ].join('\n')

    return { css, warnings }
  }

export const compile = (config: CharpenteConfig = {}): CompileResult => createCompiler(builtinThemes)(config)
