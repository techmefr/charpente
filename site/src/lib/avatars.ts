import { palette } from './palette'

const encode = (svg: string): string => `data:image/svg+xml,${encodeURIComponent(svg)}`

export const avatar = (initials: string, background: string, foreground = palette.white): string =>
  encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${background}"/><text x="32" y="40" font-family="system-ui,sans-serif" font-size="24" font-weight="700" text-anchor="middle" fill="${foreground}">${initials}</text></svg>`,
  )

export const photo = (from: string, to: string): string =>
  encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="320" height="120" fill="url(#g)"/><circle cx="250" cy="34" r="16" fill="rgba(255,255,255,.6)"/><path d="M0 120 L90 50 L150 100 L210 62 L320 120Z" fill="rgba(0,0,0,.22)"/></svg>`,
  )

export const PEOPLE = [
  { name: 'Camille Durand', role: 'Project lead', initials: 'CD', color: palette.teal },
  { name: 'Mehdi Lambert', role: 'Front-end developer', initials: 'ML', color: palette.violet },
  { name: 'Inès Morel', role: 'Designer', initials: 'IM', color: palette.rust },
  { name: 'Hugo Perrin', role: 'Back-end developer', initials: 'HP', color: palette.green },
]
