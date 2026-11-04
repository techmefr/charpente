import type { ThemeDef } from 'charpente/lite'
import { mountGenerator } from '../generator'
import type { SaveResult } from '../generator/ui/code-panel'

const loadThemes = (): Promise<Record<string, ThemeDef>> =>
  new Promise((done, fail) => {
    const script = Object.assign(document.createElement('script'), { src: '/themes.js' })
    script.addEventListener('load', () => done((globalThis as unknown as { charpenteThemes: Record<string, ThemeDef> }).charpenteThemes))
    script.addEventListener('error', () => fail(new Error('charpente-studio: could not load the built-in themes')))
    document.head.append(script)
  })

const save = async (state: unknown, overwrite: boolean): Promise<SaveResult> => {
  const response = await fetch('/api/themes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ state, overwrite }),
  })
  const result = (await response.json()) as { file?: string; error?: string }
  if (response.ok) return { ok: true, message: `Saved ${result.file}` }
  return { ok: false, conflict: response.status === 409, message: result.error ?? 'Could not save' }
}

void mountGenerator(document.getElementById('generator') as HTMLElement, { loadThemes, save: (state, overwrite) => save(state, overwrite), hash: true })
