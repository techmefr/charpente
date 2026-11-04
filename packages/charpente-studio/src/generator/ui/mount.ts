import type { PaintType, ThemeDef } from 'charpente/lite'
import { sourceToState } from '../import'
import { decodeState, encodeState } from '../share'
import { emptyState, startState, type GeneratorState } from '../state'
import { codePanel, type SaveResult } from './code-panel'
import { bordersSection, shapesSection } from './controls-shape'
import { backdropSection, colorsSection, motionSection, starterSection, startControl, targetControl } from './controls-misc'
import { hoverSection, paintSection } from './controls-paint'
import { GENERATOR_CSS } from './css'
import { h, labelled, section } from './dom'
import { PREVIEW_THEME, previewCss } from './preview'
import { SAMPLE_HTML, VIDEO_SAMPLE_HTML } from './sample'
import { createStore } from './store'

export interface GeneratorOptions {
  loadThemes: () => Promise<Record<string, ThemeDef>>
  save?: (state: GeneratorState, overwrite: boolean) => Promise<SaveResult>
  hash?: boolean
}

const HASH_DELAY = 250

const importSection = (load: (source: string) => Promise<string>): HTMLElement => {
  const area = h('textarea', { rows: 6, spellcheck: 'false', placeholder: "export default defineTheme({ ... })" })
  const button = h('button', { type: 'button', class: 'gen-button' }, 'Load this theme.ts')
  const status = h('p', { class: 'gen-status', role: 'status' })
  button.addEventListener('click', async () => {
    try {
      status.textContent = await load(area.value)
    } catch (error) {
      status.textContent = (error as Error).message.replace('charpente-studio: ', '')
    }
  })
  return section('Import a theme.ts', false, labelled('Paste a generated theme file', area), button, status).root
}

export const mountGenerator = async (host: HTMLElement, options: GeneratorOptions): Promise<void> => {
  let themes: Record<string, ThemeDef> = {}
  let forced = false
  let timer = 0
  const previewStyle = h('style')
  document.head.append(h('style', { 'data-generator': '' }, GENERATOR_CSS), previewStyle)
  const stage = h('div', { class: 'gen-stage gen-light' })
  const root = h('div', { class: 'gen-stage-grid', 'data-charpente-loading': true, 'data-charpente-theme': PREVIEW_THEME, 'aria-busy': 'true', role: 'group', 'aria-label': 'Live preview' })
  const setSample = (videos: boolean): void => {
    root.innerHTML = videos ? VIDEO_SAMPLE_HTML : SAMPLE_HTML
    root.classList.toggle('gen-stage-videos', videos)
    for (const button of root.querySelectorAll('button')) button.tabIndex = -1
  }
  setSample(false)
  stage.append(root)

  const ensure = async (name: string): Promise<void> => {
    if (name && !themes[name]) themes = await options.loadThemes()
  }

  const panel = codePanel(() => store.state, options.save && ((overwrite) => options.save!(store.state, overwrite)))

  const render = (): void => {
    if (store.state.extends && !themes[store.state.extends]) return
    previewStyle.textContent = previewCss(store.state, themes, forced)
    root.style.setProperty('--charpente-speed', String(store.state.speed))
    const unit = store.state.motions.includes('border-beam') ? 'deg' : '%'
    root.style.setProperty('--charpente-beam-size', `${store.state.beamSize}${unit}`)
    root.style.setProperty('--charpente-beam-width', `${store.state.beamWidth}px`)
    panel.update(store.state)
    if (options.hash) {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => history.replaceState(null, '', `#${encodeState(store.state)}`), HASH_DELAY)
    }
  }

  const store = createStore(emptyState(), render)
  const clipOf = (name: string, type: PaintType): boolean => {
    const def = themes[name]
    if (!def) return false
    return Boolean(def.paint?.[type]?.style?.clipPath) || (def.extends ? clipOf(def.extends, type) : false)
  }
  store.parentClip = (type) => clipOf(store.state.extends, type)
  const adopt = async (state: GeneratorState): Promise<void> => {
    await ensure(state.extends)
    store.replace(state.extends && !themes[state.extends] ? { ...state, extends: '' } : state)
  }
  const controls = [
    startControl(store, (name) => adopt(startState(name, store.state.name))),
    targetControl(store),
    starterSection(store),
    shapesSection(store),
    bordersSection(store),
    paintSection(store),
    motionSection(store),
    hoverSection(store),
    colorsSection(store),
    backdropSection(store),
  ]
  for (const control of controls) store.register(control)

  const dark = h('input', { type: 'checkbox' })
  dark.addEventListener('change', () => {
    stage.classList.toggle('gen-dark', dark.checked)
    stage.classList.toggle('gen-light', !dark.checked)
  })
  const force = h('input', { type: 'checkbox' })
  force.addEventListener('change', () => {
    forced = force.checked
    render()
  })
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const videos = h('input', { type: 'checkbox' })
  videos.addEventListener('change', () => setSample(videos.checked))
  const toolbar = h(
    'div',
    { class: 'gen-toolbar' },
    h('label', { class: 'gen-chip' }, videos, h('span', {}, 'Video grid')),
    h('label', { class: 'gen-chip' }, dark, h('span', {}, 'Dark preview')),
    h('label', { class: 'gen-chip' }, force, h('span', {}, reduced ? 'Play animations (your system asks for reduced motion)' : 'Force animations')),
  )

  const intro = h('div', { class: 'gen-panel' }, controls[0]!.root, controls[1]!.root)
  const imported = importSection(async (source) => {
    const { state, ignored } = sourceToState(source, store.state.name)
    await adopt(state)
    return ignored.length > 0 ? `Loaded. Not editable here and dropped: ${ignored.join(', ')}.` : 'Loaded.'
  })
  host.classList.add('gen')
  host.replaceChildren(
    h('div', { class: 'gen-controls' }, intro, ...controls.slice(2).map((control) => control.root), imported),
    h('div', { class: 'gen-output' }, toolbar, stage, panel.root),
  )

  const initial = options.hash ? decodeState(location.hash) : undefined
  await adopt(initial ?? emptyState())
}
