const encode = (svg: string): string => `data:image/svg+xml,${encodeURIComponent(svg)}`

export const avatar = (initials: string, background: string, foreground = '#ffffff'): string =>
  encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${background}"/><text x="32" y="40" font-family="system-ui,sans-serif" font-size="24" font-weight="700" text-anchor="middle" fill="${foreground}">${initials}</text></svg>`,
  )

export const photo = (from: string, to: string): string =>
  encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="320" height="120" fill="url(#g)"/><circle cx="250" cy="34" r="16" fill="rgba(255,255,255,.6)"/><path d="M0 120 L90 50 L150 100 L210 62 L320 120Z" fill="rgba(0,0,0,.22)"/></svg>`,
  )

export const PEOPLE = [
  { name: 'Camille Durand', role: 'Cheffe de projet', initials: 'CD', color: '#0b5f73' },
  { name: 'Mehdi Lambert', role: 'Développeur front', initials: 'ML', color: '#7a3e9d' },
  { name: 'Inès Morel', role: 'Designeuse', initials: 'IM', color: '#a1400f' },
  { name: 'Hugo Perrin', role: 'Développeur back', initials: 'HP', color: '#2b6a2f' },
]
