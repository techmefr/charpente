import { isColor } from '../validate'
import { COLOR_KEYS, LEAVES, MOTION_NAMES, startState, type MotionName } from '../state'
import { BUILTIN_NAMES } from '../share'
import { h, labelled, optionList, section, uid } from './dom'
import type { Control, Store, Target } from './store'

const TARGETS: readonly (readonly [Target, string])[] = [['all', 'All leaves'], ...LEAVES.map((type) => [type, type[0]?.toUpperCase() + type.slice(1)] as const)]

export const targetControl = (store: Store): Control => {
  const name = uid('gen-target')
  const items = TARGETS.map(([value, label]) => {
    const input = h('input', { type: 'radio', name, value })
    input.addEventListener('change', () => {
      store.target = value
      store.refresh()
    })
    return { value, input, label: h('label', { class: 'gen-chip' }, input, h('span', {}, label)) }
  })
  const root = h('fieldset', { class: 'gen-target' }, h('legend', {}, 'Leaves to edit'), h('div', { class: 'gen-chips' }, ...items.map((item) => item.label)))
  return {
    root,
    refresh: () => {
      for (const item of items) item.input.checked = item.value === store.target
    },
  }
}

export const startControl = (store: Store, start: (name: string) => Promise<void>): Control => {
  const select = optionList(h('select'), [['', 'Empty theme'], ...BUILTIN_NAMES.map((name) => [name, name] as const)])
  select.addEventListener('change', () => void start(select.value))
  const name = h('input', { type: 'text', autocomplete: 'off', spellcheck: 'false', maxlength: 41 })
  name.addEventListener('input', () => {
    if (/^[a-z][a-z0-9-]{0,40}$/.test(name.value)) store.change((state) => (state.name = name.value))
  })
  const body = h('div', { class: 'gen-start' }, labelled('Start from', select, 'Built-in themes load on demand.'), labelled('Theme name', name, 'Lowercase letters, digits and dashes.'))
  return {
    root: body,
    refresh: () => {
      select.value = store.state.extends
      if (document.activeElement !== name) name.value = store.state.name
    },
  }
}

export const motionSection = (store: Store): Control => {
  const boxes = MOTION_NAMES.map((motion) => {
    const input = h('input', { type: 'checkbox', value: motion })
    input.addEventListener('change', () =>
      store.change((state) => {
        const set = new Set<MotionName>(state.motions)
        if (input.checked) set.add(motion)
        else set.delete(motion)
        state.motions = MOTION_NAMES.filter((name) => set.has(name))
      }),
    )
    return { motion, input, label: h('label', { class: 'gen-chip' }, input, h('span', {}, motion)) }
  })
  const number = (min: number, max: number, step: number, set: (value: number) => void): HTMLInputElement => {
    const input = h('input', { type: 'number', min, max, step })
    input.addEventListener('input', () => store.change(() => set(Math.min(max, Math.max(min, Number(input.value) || 0)))))
    return input
  }
  const speed = number(0.25, 3, 0.05, (value) => (store.state.speed = value))
  const beamSize = number(10, 360, 5, (value) => (store.state.beamSize = value))
  const beamWidth = number(1, 12, 1, (value) => (store.state.beamWidth = value))
  const delay = number(0, 2000, 10, (value) => (store.state.delay = value))
  const stagger = number(0, 1000, 10, (value) => (store.state.stagger = value))
  const { root } = section(
    'Motion',
    false,
    h('div', { class: 'gen-chips', role: 'group', 'aria-label': 'Motions' }, ...boxes.map((box) => box.label)),
    labelled('Duration multiplier (--charpente-speed)', speed, 'Above 1 is slower, below 1 is faster.'),
    labelled('Beam size (--charpente-beam-size)', beamSize, 'Degrees around the border, percent of the edge for the line.'),
    labelled('Beam width (px)', beamWidth, 'Thickness of the border beam.'),
    labelled('Delay (ms)', delay),
    labelled('Stagger (ms)', stagger),
  )
  return {
    root,
    refresh: () => {
      for (const box of boxes) box.input.checked = store.state.motions.includes(box.motion)
      for (const [input, value] of [[speed, store.state.speed], [beamSize, store.state.beamSize], [beamWidth, store.state.beamWidth], [delay, store.state.delay], [stagger, store.state.stagger]] as const) {
        if (document.activeElement !== input) input.value = String(value)
      }
    },
  }
}

export const colorsSection = (store: Store): Control => {
  const site = h('input', { type: 'checkbox', id: uid('gen-site') })
  site.addEventListener('change', () => store.change((state) => (state.siteColors = site.checked)))
  const pickers = (['light', 'dark'] as const).flatMap((mode) =>
    COLOR_KEYS.map((key) => {
      const input = h('input', { type: 'color' })
      input.addEventListener('input', () => isColor(input.value) && store.change((state) => (state.colors[mode][key] = input.value)))
      return { mode, key, input, field: labelled(`${key} (${mode})`, input) }
    }),
  )
  const grid = h('div', { class: 'gen-colors' }, ...pickers.map((picker) => picker.field))
  const { root } = section('Colors', false, h('div', { class: 'gen-check' }, site, h('label', { for: site.id }, "Use my site's colors")), h('p', { class: 'gen-note' }, 'The theme reads var(--charpente-base), var(--charpente-strong)... from your site. Turn this off to fix values.'), grid)
  return {
    root,
    refresh: () => {
      site.checked = store.state.siteColors
      grid.hidden = store.state.siteColors
      for (const picker of pickers) picker.input.value = /^#[0-9a-f]{6}$/i.test(store.state.colors[picker.mode][picker.key]) ? store.state.colors[picker.mode][picker.key] : '#000000'
    },
  }
}

export const resetState = (store: Store, extendsName: string): void => store.replace(startState(extendsName, store.state.name))
