import { activeTheme } from 'virtual:charpente.theme'

const input = document.querySelector<HTMLInputElement>('#calendar-date')
const label = document.querySelector<HTMLElement>('#calendar-theme')
const call = document.querySelector<HTMLElement>('#calendar-call')
const sample = document.querySelector<HTMLElement>('#calendar-sample .sample')

const update = (): void => {
  if (!input || !label || !call || !sample) return
  const value = input.value
  const theme = value ? activeTheme(new Date(`${value}T12:00:00Z`)) : activeTheme()
  label.textContent = theme
  call.textContent = value ? `activeTheme(new Date('${value}T12:00:00Z'))` : 'activeTheme()'
  sample.setAttribute('data-charpente-theme', theme)
}

if (input) {
  input.value = new Date().toISOString().slice(0, 10)
  input.addEventListener('input', update)
  input.addEventListener('change', update)
}

update()
