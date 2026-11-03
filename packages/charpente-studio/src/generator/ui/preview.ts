import { compile, type ThemeDef } from 'charpente/lite'
import { stateToTheme } from '../build'
import type { GeneratorState } from '../state'

export const PREVIEW_THEME = 'gen-preview'

const REDUCED = '@media (prefers-reduced-motion: reduce) {'

const stripReduced = (css: string): string => {
  let out = css
  for (let start = out.indexOf(REDUCED); start !== -1; start = out.indexOf(REDUCED)) {
    let depth = 0
    let end = start + REDUCED.length - 1
    do {
      if (out[end] === '{') depth++
      if (out[end] === '}') depth--
      end++
    } while (depth > 0 && end < out.length)
    out = out.slice(0, start) + out.slice(end)
  }
  return out
}

export const previewCss = (state: GeneratorState, themes: Record<string, ThemeDef>, forceMotion: boolean): string => {
  const { css } = compile({
    themes: { ...themes, [PREVIEW_THEME]: stateToTheme(state) },
    defaultTheme: PREVIEW_THEME,
    motion: state.motions.length > 0 ? state.motions : 'none',
    timing: { delay: state.delay, stagger: state.stagger },
    colorScheme: { dark: '.gen-dark', light: '.gen-light' },
  })
  return forceMotion ? stripReduced(css) : css
}
