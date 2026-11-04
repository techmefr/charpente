import { FILES, configSource, speedSource, themeSource } from '../source'
import type { GeneratorState } from '../state'
import { h, uid } from './dom'

type Kind = keyof typeof FILES

const SOURCES: Record<Kind, (state: GeneratorState) => string> = { theme: themeSource, config: configSource, speed: speedSource }

export interface SaveResult {
  ok: boolean
  conflict?: boolean
  message: string
}

export interface CodePanel {
  root: HTMLElement
  update: (state: GeneratorState) => void
  say: (message: string) => void
}

const copy = async (text: string, area: HTMLTextAreaElement): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    area.select()
    return document.execCommand('copy')
  }
}

export const codePanel = (current: () => GeneratorState, save?: (overwrite: boolean) => Promise<SaveResult>): CodePanel => {
  let kind: Kind = 'theme'
  const area = h('textarea', { class: 'gen-code-area', readonly: true, rows: 16, spellcheck: 'false', 'aria-label': 'Generated file' })
  const status = h('p', { class: 'gen-status', role: 'status' })
  const name = uid('gen-file')
  const tabs = (Object.keys(FILES) as Kind[]).map((key) => {
    const input = h('input', { type: 'radio', name, value: key })
    input.checked = key === kind
    input.addEventListener('change', () => {
      kind = key
      update(current())
    })
    return h('label', { class: 'gen-chip' }, input, h('span', {}, FILES[key]))
  })
  const update = (state: GeneratorState): void => {
    area.value = SOURCES[kind](state)
  }
  const say = (message: string): void => {
    status.textContent = message
  }
  const copyButton = h('button', { type: 'button', class: 'gen-button' }, 'Copy')
  copyButton.addEventListener('click', async () => say((await copy(area.value, area)) ? `Copied ${FILES[kind]}` : 'Copy failed, select the text instead'))
  const download = h('button', { type: 'button', class: 'gen-button' }, 'Download')
  download.addEventListener('click', () => {
    const link = h('a', { href: URL.createObjectURL(new Blob([area.value], { type: 'text/plain' })), download: FILES[kind] })
    link.click()
    URL.revokeObjectURL(link.href)
    say(`Downloaded ${FILES[kind]}`)
  })
  const actions = [copyButton, download]
  if (save) {
    const button = h('button', { type: 'button', class: 'gen-button gen-primary' }, 'Save to themes folder')
    button.addEventListener('click', async () => {
      let result = await save(false)
      if (result.conflict && window.confirm(`${result.message}. Overwrite it?`)) result = await save(true)
      say(result.message)
    })
    actions.push(button)
  }
  const root = h('section', { class: 'gen-code', 'aria-label': 'Generated files' }, h('div', { class: 'gen-chips', role: 'radiogroup', 'aria-label': 'File' }, ...tabs), area, h('div', { class: 'gen-actions-row' }, ...actions), status)
  return { root, update, say }
}
