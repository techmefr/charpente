import type { ThemeDef } from 'charpente'

const image = (body: string, viewBox: string): string =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`)}")`

const BAT = image(
  `<path d="M0-3C-2-8-8-9-15-5C-11-5-9-3-9 0C-7-2-5-1-3 2C-2 0-1 1 0 3C1 1 2 0 3 2C5-1 7-2 9 0C9-3 11-5 15-5C8-9 2-8 0-3Z" fill="#05020a"/><circle cx="-1.2" cy="-3.6" r=".8" fill="#f97316"/><circle cx="1.2" cy="-3.6" r=".8" fill="#f97316"/>`,
  '-16 -10 32 14',
)

const MOON = image(
  `<circle r="58" fill="#f6c453" fill-opacity=".14"/><circle r="40" fill="#f6c453"/><circle cx="-12" cy="-10" r="8" fill="#e2a93b"/><circle cx="14" cy="8" r="11" fill="#e2a93b"/><circle cx="-4" cy="20" r="5" fill="#e2a93b"/>`,
  '-60 -60 120 120',
)

const webOf = (size: number): string => {
  const angles = [3, 18, 33, 48, 63, 78, 88]
  const at = (angle: number, radius: number): string => `${(Math.cos((angle * Math.PI) / 180) * radius).toFixed(1)} ${(Math.sin((angle * Math.PI) / 180) * radius).toFixed(1)}`
  const spokes = angles.map((angle) => `M0 0L${at(angle, size)}`).join('')
  const arcs = [0.2, 0.34, 0.48, 0.62, 0.76, 0.9]
    .flatMap((ring) => angles.slice(1).map((angle, index) => `M${at(angles[index] as number, ring * size)}Q${at((angle + (angles[index] as number)) / 2, ring * size * 0.9)} ${at(angle, ring * size)}`))
    .join('')
  return image(`<path d="${spokes}${arcs}" fill="none" stroke="#cfc6e6" stroke-width=".8" stroke-opacity=".8"/>`, `0 0 ${size} ${size}`)
}

const PUMPKIN = image(
  `<ellipse cx="-7" rx="9" ry="10" fill="#ea580c"/><ellipse cx="7" rx="9" ry="10" fill="#ea580c"/><ellipse rx="8" ry="10.5" fill="#f97316"/><path d="M-1-10Q0-15 4-16" stroke="#4d7c0f" stroke-width="2.2" fill="none"/><path d="M-6-2L-3-6L0-2ZM1-2L4-6L7-2ZM-5 4Q0 9 5 4Q0 6-5 4Z" fill="#2a1005"/>`,
  '-18 -18 36 30',
)

const TREE = image(
  `<path d="M0 0V-34M0-12L-12-24M0-20L10-32M-12-24L-17-26M-12-24L-14-31M10-32L16-34M10-32L12-39M0-34L-3-42M0-34L5-41" stroke="#05020a" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  '-20 -46 40 46',
)

const GHOST = image(
  `<path d="M-9 10V-4Q-9-14 0-14T9-4V10L6 7L3 10L0 7L-3 10L-6 7Z" fill="#ece7f7" fill-opacity=".92"/><circle cx="-3" cy="-4" r="1.5" fill="#2a1744"/><circle cx="3" cy="-4" r="1.5" fill="#2a1744"/><ellipse cy="1" rx="1.6" ry="2.2" fill="#2a1744"/>`,
  '-10 -15 20 26',
)

interface Piece {
  image: string
  size: string
  at: string
}

const NIGHT = 'linear-gradient(180deg, #2c1850, #1a0f33)'

const sheet = (pieces: Piece[], radius: string) => ({
  fill: [...pieces.map(({ image: source }) => source), NIGHT].join(', '),
  size: [...pieces.map(({ size }) => size), 'auto'].join(', '),
  position: pieces.map(({ at }) => at).join(', '),
  repeat: [...pieces.map(() => 'no-repeat'), 'repeat'].join(', '),
  style: { borderRadius: radius, boxShadow: 'inset 0 0 0 1px rgba(249,115,22,.35)' },
})

const BLOCK: Piece[] = [
  { image: webOf(84), size: '84px 84px', at: 'left top' },
  { image: MOON, size: '58px 58px', at: 'right 6% top 1px' },
  { image: BAT, size: '40px 17px', at: '24% 20%' },
  { image: BAT, size: '24px 10px', at: '66% 30%' },
  { image: TREE, size: '30px 35px', at: 'left 36% bottom 0' },
  { image: GHOST, size: '26px 34px', at: 'left 49% bottom 4px' },
  { image: PUMPKIN, size: '32px 27px', at: 'right 26% bottom 2px' },
]

const MEDIA: Piece[] = [
  { image: webOf(64), size: '64px 64px', at: 'left top' },
  { image: MOON, size: '44px 44px', at: 'right 9% top 3px' },
  { image: BAT, size: '34px 15px', at: '34% 30%' },
  { image: BAT, size: '22px 10px', at: '64% 62%' },
  { image: PUMPKIN, size: '26px 22px', at: 'left 46% bottom 2px' },
]

const CONTROL: Piece[] = [
  { image: MOON, size: '20px 20px', at: 'left 10% center' },
  { image: BAT, size: '24px 10px', at: 'right 14% center' },
]

const TEXT: Piece[] = [
  { image: BAT, size: '22px 10px', at: 'right 8% center' },
  { image: BAT, size: '14px 6px', at: 'left 31% top 22%' },
]

export default {
  tokens: { base: '#1a0f33', strong: '#f97316', accent: '#f97316', accent2: '#8b5cf6' },
  dark: { shine: 'rgba(255,255,255,0.16)' },
  paint: {
    text: sheet(TEXT, '4px'),
    control: sheet(CONTROL, '999px'),
    media: sheet(MEDIA, '8px'),
    block: sheet(BLOCK, '8px'),
  },
} satisfies ThemeDef
