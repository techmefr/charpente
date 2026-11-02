import { compile } from 'charpente'
import { formToTheme, type ThemeForm } from '../theme-file'

const field = <Element extends HTMLElement>(id: string): Element => document.getElementById(id) as Element

const readForm = (): ThemeForm => ({
  name: field<HTMLInputElement>('name').value.trim(),
  colors: [field<HTMLInputElement>('base').value, field<HTMLInputElement>('strong').value],
  pattern: field<HTMLSelectElement>('pattern').value as ThemeForm['pattern'],
  radius: Number(field<HTMLInputElement>('radius').value),
  scale: Number(field<HTMLInputElement>('scale').value),
})

const render = (): void => {
  const { css } = compile({
    themes: { studio: formToTheme(readForm()) },
    defaultTheme: 'studio',
    motion: field<HTMLSelectElement>('motion').value,
  })
  field('skeleton').textContent = css
  field('stage').classList.toggle('dark', field<HTMLInputElement>('dark').checked)
}

const say = (message: string): void => {
  field('status').textContent = message
}

const refreshThemes = async (): Promise<void> => {
  const names = (await (await fetch('/api/themes')).json()) as string[]
  field('themes').replaceChildren(
    ...names.map((name) => Object.assign(document.createElement('li'), { textContent: name })),
  )
}

const save = async (): Promise<void> => {
  const response = await fetch('/api/themes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(readForm()),
  })
  const result = (await response.json()) as { file?: string; error?: string }
  say(response.ok ? `Saved ${result.file}` : (result.error ?? 'Could not save'))
  if (response.ok) await refreshThemes()
}

for (const element of document.querySelectorAll('aside input, aside select')) element.addEventListener('input', render)
field('save').addEventListener('click', () => void save())
render()
void refreshThemes()
