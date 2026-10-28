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
  { path: '', label: 'Accueil', summary: 'Présentation et démo vivante' },
  { path: 'demarrage', label: 'Démarrage', summary: 'Installation et intégrations' },
  { path: 'themes', label: 'Thèmes', summary: 'Les 35 thèmes rendus en vrai' },
  { path: 'motions', label: 'Motions et timing', summary: 'Animations, délai, stagger' },
  { path: 'configuration', label: 'Configuration', summary: 'Référence de charpente.config.ts' },
  { path: 'calendrier', label: 'Calendrier saisonnier', summary: 'Un thème selon la date' },
  { path: 'creer-un-theme', label: 'Créer un thème', summary: 'Tutoriel pas à pas' },
  { path: 'terrain-de-jeu', label: 'Terrain de jeu', summary: 'Tout régler en direct' },
  { path: 'accessibilite', label: 'Accessibilité', summary: 'Ce que charpente fait et ne fait pas' },
]

export const THEMES = [
  { name: 'solid', label: 'Solid', note: 'Aplat avec lignes de texte' },
  { name: 'outline', label: 'Outline', note: 'Contours en pointillés' },
  { name: 'dots', label: 'Dots', note: 'Trame de points' },
  { name: 'cyberpunk', label: 'Cyberpunk', note: 'Néon, scanlines et angles coupés' },
  { name: 'web', label: 'Web', note: 'Toile d’araignée' },
  { name: 'paper', label: 'Paper', note: 'Papier rayé, ton chaud' },
  { name: 'glass', label: 'Glass', note: 'Verre dépoli, reflet' },
  { name: 'blueprint', label: 'Blueprint', note: 'Plan bleu quadrillé' },
  { name: 'halftone', label: 'Halftone', note: 'Trame de points d’imprimerie' },
  { name: 'stripes', label: 'Stripes', note: 'Bandes diagonales' },
  { name: 'scanline', label: 'Scanline', note: 'Lignes de balayage' },
  { name: 'neon', label: 'Neon', note: 'Contour lumineux' },
  { name: 'aurora', label: 'Aurora', note: 'Dégradé boréal' },
  { name: 'brutalist', label: 'Brutalist', note: 'Bloc dur, ombre franche' },
  { name: 'sketch', label: 'Sketch', note: 'Hachures au crayon' },
  { name: 'topo', label: 'Topo', note: 'Courbes de niveau' },
  { name: 'waves', label: 'Waves', note: 'Ondes bleues' },
  { name: 'editorial', label: 'Editorial', note: 'Colonnes typographiques, trame d’impression' },
  { name: 'commerce', label: 'Commerce', note: 'Étiquettes et carton d’emballage' },
  { name: 'analytics', label: 'Analytics', note: 'Microgrille et segments de données' },
  { name: 'gaming', label: 'Gaming', note: 'Pixels et barres de HUD' },
  { name: 'music', label: 'Music', note: 'Barres d’égaliseur' },
  { name: 'developer', label: 'Developer', note: 'Blocs de code monospace' },
  { name: 'travel', label: 'Travel', note: 'Courbes de niveau et itinéraire pointillé' },
  { name: 'wellness', label: 'Wellness', note: 'Courbes douces, grain léger' },
  { name: 'valentine', label: 'Valentine', note: 'Petits cœurs, rose doux' },
  { name: 'birthday', label: 'Birthday', note: 'Vermicelles colorés' },
  { name: 'pride', label: 'Pride', note: 'Bandes arc-en-ciel' },
  { name: 'halloween', label: 'Halloween', note: 'Fantômes orange et violet' },
  { name: 'christmas', label: 'Christmas', note: 'Rayures rouges et vertes, neige' },
  { name: 'new-year', label: 'New year', note: 'Confettis dorés' },
  { name: 'winter', label: 'Winter', note: 'Givre et flocons' },
  { name: 'summer', label: 'Summer', note: 'Vagues chaudes' },
  { name: 'spring', label: 'Spring', note: 'Fleurs sur fond tendre' },
  { name: 'autumn', label: 'Autumn', note: 'Feuilles en bandes' },
]

export const CUSTOM_THEMES = [
  { name: 'brume', label: 'Brume (perso)' },
  { name: 'brume-ronde', label: 'Brume ronde (perso)' },
]

export const MOTIONS = [
  { name: 'shimmer', note: 'Reflet qui balaie la forme' },
  { name: 'pulse', note: 'Respiration de l’opacité, toutes les formes ensemble' },
  { name: 'wave', note: 'Opacité décalée selon la position (stagger)' },
  { name: 'glitch', note: 'Petits sauts de position' },
]
