export const SITE_NAME = 'charpente'

export const href = (path = ''): string => {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
  const clean = path.replace(/^\/+/, '')
  return clean === '' ? `${base}/` : `${base}/${clean.replace(/\/*$/, '/')}`
}

export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`

export interface NavItem {
  path: string
  label: string
  summary: string
}

export const NAV: NavItem[] = [
  { path: '', label: 'Home', summary: 'Overview and live demo' },
  { path: 'getting-started', label: 'Getting started', summary: 'Installation and integrations' },
  { path: 'themes', label: 'Themes', summary: 'All 35 themes rendered for real' },
  { path: 'motions', label: 'Motions and timing', summary: 'Animations, delay, stagger' },
  { path: 'configuration', label: 'Configuration', summary: 'charpente.config.ts reference' },
  { path: 'calendar', label: 'Seasonal calendar', summary: 'A theme chosen by date' },
  { path: 'create-a-theme', label: 'Create a theme', summary: 'Step-by-step tutorial' },
  { path: 'playground', label: 'Playground', summary: 'Tweak everything live' },
  { path: 'accessibility', label: 'Accessibility', summary: 'What charpente does and does not do' },
]

export const THEMES = [
  { name: 'solid', label: 'Solid', note: 'Flat fill with text lines' },
  { name: 'outline', label: 'Outline', note: 'Dotted outlines' },
  { name: 'dots', label: 'Dots', note: 'Dot pattern' },
  { name: 'cyberpunk', label: 'Cyberpunk', note: 'Neon, scanlines and cut corners' },
  { name: 'web', label: 'Web', note: 'Spider web' },
  { name: 'paper', label: 'Paper', note: 'Ruled paper, warm tone' },
  { name: 'glass', label: 'Glass', note: 'Frosted glass, glint' },
  { name: 'blueprint', label: 'Blueprint', note: 'Blue gridded plan' },
  { name: 'halftone', label: 'Halftone', note: 'Print halftone dots' },
  { name: 'stripes', label: 'Stripes', note: 'Diagonal bands' },
  { name: 'scanline', label: 'Scanline', note: 'Sweep lines' },
  { name: 'neon', label: 'Neon', note: 'Glowing outline' },
  { name: 'aurora', label: 'Aurora', note: 'Northern-lights gradient' },
  { name: 'brutalist', label: 'Brutalist', note: 'Hard block, sharp shadow' },
  { name: 'sketch', label: 'Sketch', note: 'Pencil hatching' },
  { name: 'topo', label: 'Topo', note: 'Contour lines' },
  { name: 'waves', label: 'Waves', note: 'Blue waves' },
  { name: 'editorial', label: 'Editorial', note: 'Typographic columns, print screen' },
  { name: 'commerce', label: 'Commerce', note: 'Labels and packaging cardboard' },
  { name: 'analytics', label: 'Analytics', note: 'Micro-grid and data segments' },
  { name: 'gaming', label: 'Gaming', note: 'Pixels and HUD bars' },
  { name: 'music', label: 'Music', note: 'Equalizer bars' },
  { name: 'developer', label: 'Developer', note: 'Monospace code blocks' },
  { name: 'travel', label: 'Travel', note: 'Contour lines and dotted route' },
  { name: 'wellness', label: 'Wellness', note: 'Soft curves, light grain' },
  { name: 'valentine', label: 'Valentine', note: 'Little hearts, soft pink' },
  { name: 'birthday', label: 'Birthday', note: 'Colored sprinkles' },
  { name: 'pride', label: 'Pride', note: 'Rainbow bands' },
  { name: 'halloween', label: 'Halloween', note: 'Orange and purple ghosts' },
  { name: 'christmas', label: 'Christmas', note: 'Red and green stripes, snow' },
  { name: 'new-year', label: 'New year', note: 'Golden confetti' },
  { name: 'winter', label: 'Winter', note: 'Frost and snowflakes' },
  { name: 'summer', label: 'Summer', note: 'Warm waves' },
  { name: 'spring', label: 'Spring', note: 'Flowers on a soft background' },
  { name: 'autumn', label: 'Autumn', note: 'Leaves in bands' },
]

export const CUSTOM_THEMES = [
  { name: 'brume', label: 'Brume (custom)' },
  { name: 'brume-ronde', label: 'Brume ronde (custom)' },
]

export const MOTIONS = [
  { name: 'shimmer', note: 'Glint sweeping across the shape' },
  { name: 'pulse', note: 'Opacity breathing, all shapes together' },
  { name: 'wave', note: 'Opacity offset by position (stagger)' },
  { name: 'glitch', note: 'Small position jumps' },
]
