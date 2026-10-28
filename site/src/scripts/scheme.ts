const root = document.documentElement
const buttons = document.querySelectorAll<HTMLButtonElement>('[data-scheme-toggle]')

const isDark = (): boolean => root.getAttribute('data-theme') === 'dark'

const sync = (): void => {
  for (const button of buttons) button.setAttribute('aria-pressed', String(isDark()))
}

for (const button of buttons) {
  button.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    try {
      localStorage.setItem('charpente-scheme', next)
    } catch {
      root.setAttribute('data-theme', next)
    }
    sync()
  })
}

sync()
