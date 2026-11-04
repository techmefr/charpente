import { FILLS, SAMPLE_FILLS } from '../presets'
import { isSafeCss } from '../validate'
import { HOVER_MOTIONS } from '../state'
import { bindText } from './controls-shape'
import { h, labelled, optionList, section } from './dom'
import type { Control, Store } from './store'

const MOTION_LABELS: Record<string, string> = { inherit: 'Keep (start theme)', none: 'None', pause: 'Pause the animation', faster: 'Faster animation' }

const fillTile = (store: Store, id: string, label: string, fill?: string, size?: string): { button: HTMLButtonElement; refresh: () => void } => {
  const swatch = h('span', { class: 'gen-swatch gen-swatch-fill', 'aria-hidden': 'true' })
  if (fill) {
    swatch.style.backgroundImage = fill
    swatch.style.backgroundSize = size || 'auto'
  }
  const button = h('button', { type: 'button', class: 'gen-tile', 'aria-pressed': 'false' }, swatch, h('span', {}, label))
  button.addEventListener('click', () => store.edit((leaf) => (leaf.fill = id)))
  return { button, refresh: () => button.setAttribute('aria-pressed', String(store.leaf().fill === id)) }
}

export const paintSection = (store: Store): Control => {
  const tiles = [fillTile(store, '', 'Keep'), ...FILLS.map((preset) => fillTile(store, preset.id, preset.label, preset.fill, preset.size))]
  const custom = h('textarea', { rows: 3, spellcheck: 'false', placeholder: 'linear-gradient(135deg, #f97316, #ec4899)' })
  const size = h('input', { type: 'text', autocomplete: 'off', spellcheck: 'false', placeholder: 'auto' })
  const problem = h('small', { class: 'gen-problem', role: 'alert' })
  custom.addEventListener('input', () => {
    const value = custom.value.trim()
    const safe = isSafeCss(value)
    problem.textContent = safe ? '' : 'This value contains characters that cannot be used in a fill.'
    if (safe) {
      store.edit((leaf) => {
        leaf.custom = value
        leaf.fill = value ? 'custom' : leaf.fill === 'custom' ? '' : leaf.fill
      })
    }
  })
  const sizeControl = bindText(store, size, (leaf) => leaf.size, (leaf, value) => (leaf.size = value))
  const samples = SAMPLE_FILLS.map((fill, index) => {
    const button = h('button', { type: 'button', class: 'gen-link' }, `Sample ${index + 1}`)
    button.addEventListener('click', () => {
      custom.value = fill
      custom.dispatchEvent(new Event('input'))
    })
    return button
  })
  const { root } = section(
    'Paint and patterns',
    true,
    h('div', { class: 'gen-tiles', role: 'group', 'aria-label': 'Pattern presets' }, ...tiles.map((tile) => tile.button)),
    labelled('Paste a CSS fill', custom, 'Gradient, pattern or url(): it applies to the selected leaves at once.'),
    h('div', { class: 'gen-inline' }, 'Try:', ...samples),
    problem,
    labelled('Fill size', size, 'Optional, for example 12px 12px.'),
  )
  return {
    root,
    refresh: () => {
      for (const tile of tiles) tile.refresh()
      sizeControl.refresh()
      if (document.activeElement !== custom) custom.value = store.leaf().custom
    },
  }
}

export const hoverSection = (store: Store): Control => {
  const fill = h('input', { type: 'text', list: 'gen-tokens', autocomplete: 'off', spellcheck: 'false', placeholder: 'accent' })
  const fillControl = bindText(store, fill, (leaf) => leaf.hover, (leaf, value) => (leaf.hover = value))
  const motion = optionList(h('select'), HOVER_MOTIONS.map((name) => [name, MOTION_LABELS[name] as string] as const))
  motion.addEventListener('change', () => store.change((state) => (state.hoverMotion = motion.value as typeof state.hoverMotion)))
  const { root } = section(
    'Hover',
    false,
    labelled('Fill on hover', fill, 'A token, a color or a gradient. Empty means no change.'),
    labelled('Animation on hover', motion),
    h('p', { class: 'gen-note' }, 'Hover the preview to try it.'),
  )
  return {
    root,
    refresh: () => {
      fillControl.refresh()
      motion.value = store.state.hoverMotion
    },
  }
}
