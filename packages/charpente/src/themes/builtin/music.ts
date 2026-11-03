import type { Paint, PaintType, ThemeDef } from '../../types'
import { buildTheme } from './build'
import { perType, random, round, svgImage } from './shapes'

const staff = (top: number, width: number, color: string): string =>
  Array.from({ length: 5 }, (_, line) => `<path d="M0 ${top + line * 5}H${width}" stroke="${color}" stroke-width=".7" opacity=".55"/>`).join('')

const note = (x: number, y: number, color: string, flag: boolean): string => {
  const head = `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="2.6" transform="rotate(-22 ${x} ${y})" fill="${color}"/>`
  const stem = `<path d="M${round(x + 3.3)} ${y - 1}V${y - 17}${flag ? `q5 3 4 9` : ''}" fill="none" stroke="${color}" stroke-width="1" stroke-linecap="round"/>`
  return head + stem
}

const melody = (seed: number, width: number, height: number, top: number, color: string): string => {
  const rand = random(seed)
  const count = Math.floor(width / 17)
  const notes = Array.from({ length: count }, (_, index) => note(round(9 + index * (width / count)), round(top + 2 + rand() * 18), color, rand() > 0.6))
  return svgImage(`${staff(top, width, color)}${notes.join('')}<path d="M${width - 1} ${top}V${top + 20}" stroke="${color}" stroke-width="1"/>`, width, height)
}

const accidentals = (width: number, height: number, color: string): string => {
  const sharp = (x: number, y: number): string =>
    `<path d="M${x} ${y}v12M${x + 3} ${y - 1}v12M${x - 2} ${y + 4}l7 -2M${x - 2} ${y + 8}l7 -2" stroke="${color}" stroke-width="1" fill="none"/>`
  const rest = (x: number, y: number): string => `<path d="M${x} ${y}l5 4l-5 4q6 2 1 7" stroke="${color}" stroke-width="1.4" fill="none"/>`
  return svgImage(`${staff(26, width, color)}${sharp(14, 20)}${rest(48, 24)}${sharp(70, 31)}`, width, height)
}

const dots = (width: number, height: number, color: string): string => {
  const rand = random(41)
  const body = Array.from({ length: 9 }, () => note(round(6 + rand() * (width - 12)), round(14 + rand() * (height - 26)), color, rand() > 0.5)).join('')
  return svgImage(body, width, height)
}

const A = () => melody(4, 136, 60, 14, '#8b5cf6')
const B = () => accidentals(90, 60, '#06b6d4')
const C = () => dots(70, 70, '#ec4899')

const SIZES: Record<PaintType, string> = {
  text: '97px 43px, 61px 41px, 37px 37px',
  media: '167px 74px, 107px 71px, 59px 59px',
  control: '71px 31px, 47px 31px, 29px 29px',
  block: '211px 93px, 131px 87px, 79px 79px',
}

const RADII: Record<PaintType, string> = { text: '3px', media: '22px 4px 22px 4px', control: '999px', block: '4px 18px 4px 18px' }

const paintOf = (type: PaintType): Paint => ({
  fill: `${A()}, ${B()}, ${C()}, linear-gradient(color-mix(in srgb, var(--charpente-accent) 9%, var(--charpente-base)), color-mix(in srgb, var(--charpente-accent2) 9%, var(--charpente-base)))`,
  size: `${SIZES[type]}, auto`,
  style: { borderRadius: RADII[type] },
})

export const music: ThemeDef = buildTheme(() => ({
  tokens: { accent: '#a855f7', accent2: '#22d3ee' },
  paint: perType(paintOf),
}))
