import type { ThemeDef } from 'charpente'

const paper = (ground: string, dot: string, line: string): ThemeDef => ({
  tokens: { base: ground, strong: line, accent: dot },
  pattern: {
    fill: (step) =>
      `radial-gradient(circle, ${dot} 0 ${1.4 * step}px, transparent ${1.4 * step + 0.5}px), repeating-linear-gradient(45deg, transparent 0 ${8 * step}px, ${line} ${8 * step}px ${9 * step}px), linear-gradient(${ground}, ${ground})`,
    size: (step) => `${12 * step}px ${12 * step}px, auto, auto`,
  },
})

export default {
  ...paper('#fecaca', '#b91c1c', '#fca5a5'),
  radius: (step) => `${3 * step}px`,
  border: { image: './border.svg', slice: 30, width: '14px' },
  dark: { shine: 'rgba(255,255,255,0.16)' },
  variants: {
    green: paper('#bbf7d0', '#15803d', '#86efac'),
    gold: paper('#fde68a', '#a16207', '#fcd34d'),
    snow: paper('#e0f2fe', '#0369a1', '#bae6fd'),
  },
} satisfies ThemeDef
