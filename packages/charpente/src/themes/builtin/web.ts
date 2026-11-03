import type { Declarations, Paint, PaintType, ThemeDef } from '../../types'
import { buildTheme } from './build'
import { perType, random, round, svgImage } from './shapes'

const THREAD = '#8593a8'

const SPOKES = [7, 21, 37, 54, 71, 84]

const polar = (angle: number, radius: number): string => {
  const rad = (angle * Math.PI) / 180
  return `${round(Math.cos(rad) * radius)} ${round(Math.sin(rad) * radius)}`
}

const cornerWeb = (flipX: boolean, flipY: boolean, rings: number): string => {
  const rand = random(7 + rings)
  const spokes = SPOKES.map((angle) => `M0 0L${polar(angle, 112)}`)
  const arcs = Array.from({ length: rings }, (_, ring) => {
    const radius = 12 + ring * (92 / rings)
    return SPOKES.slice(1)
      .map((angle, at) => {
        const before = SPOKES[at] as number
        const sag = radius * (0.8 + rand() * 0.06)
        return `M${polar(before, radius)}Q${polar((before + angle) / 2, sag)} ${polar(angle, radius)}`
      })
      .join('')
  })
  const path = `<path d="${[...spokes, ...arcs].join('')}" fill="none" stroke="${THREAD}" stroke-width="1" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`
  const move = `translate(${flipX ? 100 : 0} ${flipY ? 100 : 0}) scale(${flipX ? -0.89 : 0.89} ${flipY ? -0.89 : 0.89})`
  return svgImage(`<g transform="${move}">${path}</g>`, 100, 100)
}

const SAG = 'polygon(0 0, 50% 4%, 100% 0, 96% 50%, 100% 100%, 50% 96%, 0 100%, 4% 50%)'

const SIZES: Record<PaintType, string> = {
  text: '40px 40px, 29px 29px',
  media: '78px 78px, 53px 53px',
  control: '48px 48px, 33px 33px',
  block: '103px 103px, 71px 71px',
}

const paintOf = (type: PaintType): Paint => {
  const soft = 'linear-gradient(135deg, color-mix(in srgb, var(--charpente-base) 70%, transparent), var(--charpente-base))'
  const style: Declarations = type === 'control' ? { borderRadius: '999px' } : type === 'text' ? { borderRadius: '2px' } : { borderRadius: '0', clipPath: SAG }
  return { fill: `${cornerWeb(false, false, 5)}, ${cornerWeb(true, true, 4)}, ${soft}`, size: `${SIZES[type]}, auto`, style }
}

export const web: ThemeDef = buildTheme(() => ({
  tokens: { base: '#dde3ec', strong: '#8593a8' },
  dark: { base: '#252b36', strong: '#5b6b82' },
  paint: perType(paintOf),
}))
