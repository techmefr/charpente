import { BORDER_KINDS, TOKENS, type BorderKind, type LeafState } from '../state'
import { SHAPES } from '../presets'
import { isSafeCss } from '../validate'
import { h, labelled, section } from './dom'
import type { Control, Store } from './store'

export const bindText = (store: Store, input: HTMLInputElement | HTMLTextAreaElement, get: (leaf: LeafState) => string, set: (leaf: LeafState, value: string) => void): Control => {
  input.addEventListener('input', () => {
    const safe = isSafeCss(input.value)
    input.setAttribute('aria-invalid', String(!safe))
    if (safe) store.edit((leaf) => set(leaf, input.value))
  })
  return {
    root: input,
    refresh: () => {
      if (input.ownerDocument.activeElement !== input) input.value = get(store.leaf())
    },
  }
}

const isShape = (leaf: LeafState, preset: (typeof SHAPES)[number]): boolean =>
  leaf.radius === preset.radius && (leaf.clip === preset.clip || (preset.clip === 'none' && leaf.clip === ''))

const shapeButton = (store: Store, preset: (typeof SHAPES)[number]): { button: HTMLButtonElement; refresh: () => void } => {
  const swatch = h('span', { class: 'gen-swatch', 'aria-hidden': 'true' })
  swatch.style.borderRadius = preset.radius
  if (preset.clip !== 'none') swatch.style.clipPath = preset.clip
  const button = h('button', { type: 'button', class: 'gen-tile', 'aria-pressed': 'false' }, swatch, h('span', {}, preset.label))
  button.addEventListener('click', () =>
    store.edit((leaf) => {
      leaf.radius = preset.radius
      leaf.clip = preset.clip
    }),
  )
  return { button, refresh: () => button.setAttribute('aria-pressed', String(isShape(store.leaf(), preset))) }
}

export const shapesSection = (store: Store): Control => {
  const tiles = SHAPES.map((preset) => shapeButton(store, preset))
  const radius = h('input', { type: 'text', autocomplete: 'off', spellcheck: 'false' })
  const clip = h('input', { type: 'text', autocomplete: 'off', spellcheck: 'false', placeholder: 'none' })
  const bound = [bindText(store, radius, (leaf) => leaf.radius, (leaf, value) => (leaf.radius = value)), bindText(store, clip, (leaf) => leaf.clip, (leaf, value) => (leaf.clip = value))]
  const { root } = section(
    'Shapes',
    true,
    h('div', { class: 'gen-tiles', role: 'group', 'aria-label': 'Shape presets' }, ...tiles.map((tile) => tile.button)),
    labelled('Border radius', radius, 'Any CSS value, for example 12px or 40% 60% / 30%.'),
    labelled('Clip path', clip, 'polygon(), ellipse(), inset()... Layered shapes will plug in here.'),
  )
  return {
    root,
    refresh: () => {
      for (const tile of tiles) tile.refresh()
      for (const control of bound) control.refresh()
    },
  }
}

const KIND_LABELS: Record<BorderKind, string> = {
  inherit: 'Keep',
  none: 'None',
  solid: 'Solid',
  dashed: 'Dashed',
  dotted: 'Dotted',
  double: 'Double',
  groove: 'Groove',
  outline: 'Outline',
  inset: 'Inner line',
  diagonal: 'Diagonal',
}

export const bordersSection = (store: Store): Control => {
  const kinds = BORDER_KINDS.map((kind) => {
    const input = h('input', { type: 'radio', name: 'gen-border-kind', value: kind })
    input.addEventListener('change', () => store.edit((leaf) => (leaf.border.kind = kind)))
    return { kind, input, label: h('label', { class: 'gen-chip' }, input, h('span', {}, KIND_LABELS[kind])) }
  })
  const width = h('input', { type: 'number', min: 0, max: 40, step: 1 })
  width.addEventListener('input', () => store.edit((leaf) => (leaf.border.width = Math.min(40, Math.max(0, Number(width.value) || 0)))))
  const color = h('input', { type: 'text', list: 'gen-tokens', autocomplete: 'off', spellcheck: 'false' })
  color.addEventListener('input', () => {
    const safe = isSafeCss(color.value)
    color.setAttribute('aria-invalid', String(!safe))
    if (safe) store.edit((leaf) => (leaf.border.color = color.value.trim() || 'strong'))
  })
  const list = h('datalist', { id: 'gen-tokens' }, ...TOKENS.map((token) => h('option', { value: token })))
  const { root } = section(
    'Borders',
    false,
    h('div', { class: 'gen-chips', role: 'radiogroup', 'aria-label': 'Border style' }, ...kinds.map((item) => item.label)),
    labelled('Thickness (px)', width),
    labelled('Color', color, 'A token (base, strong, accent...) or any CSS color.'),
    list,
  )
  return {
    root,
    refresh: () => {
      const { border } = store.leaf()
      for (const item of kinds) item.input.checked = item.kind === border.kind
      if (document.activeElement !== width) width.value = String(border.width)
      if (document.activeElement !== color) color.value = border.color
    },
  }
}
