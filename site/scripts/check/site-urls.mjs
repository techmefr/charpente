export const origin = process.env.SITE_ORIGIN ?? 'http://127.0.0.1:4330'
export const base = '/charpente'
export const shotsDir = process.env.SHOTS_DIR

export const slugs = [
  '',
  'getting-started',
  'themes',
  'motions',
  'configuration',
  'calendar',
  'capture',
  'create-a-theme',
  'playground',
  'accessibility',
]

export const urlOf = (slug) => `${origin}${base}/${slug === '' ? '' : `${slug}/`}`
