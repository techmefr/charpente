const root = document.querySelector<HTMLElement>('#pg-root')
const theme = document.querySelector<HTMLSelectElement>('#pg-theme')
const motions = document.querySelectorAll<HTMLInputElement>('#pg-motions input')
const delay = document.querySelector<HTMLInputElement>('#pg-delay')
const stagger = document.querySelector<HTMLInputElement>('#pg-stagger')
const delayOut = document.querySelector<HTMLOutputElement>('#pg-delay-out')
const staggerOut = document.querySelector<HTMLOutputElement>('#pg-stagger-out')
const toggle = document.querySelector<HTMLButtonElement>('#pg-toggle')
const readout = document.querySelector<HTMLElement>('#pg-readout')
const status = document.querySelector<HTMLElement>('#pg-status')

const applySettings = (): void => {
  if (!root || !theme || !delay || !stagger) return
  const names = [...motions]
    .filter((input) => input.checked)
    .map((input) => input.value)
    .sort()
  const motion = names.length > 0 ? names.join(' ') : 'none'

  root.setAttribute('data-charpente-theme', theme.value)
  root.setAttribute('data-charpente-motion', motion)
  root.style.setProperty('--charpente-delay', `${delay.value}ms`)
  root.style.setProperty('--charpente-stagger', `${stagger.value}ms`)

  if (delayOut) delayOut.textContent = `${delay.value} ms`
  if (staggerOut) staggerOut.textContent = `${stagger.value} ms`
  if (readout) {
    readout.textContent = [
      `data-charpente-theme="${theme.value}"`,
      `data-charpente-motion="${motion}"`,
      `style="--charpente-delay: ${delay.value}ms;`,
      `       --charpente-stagger: ${stagger.value}ms"`,
    ].join('\n')
  }
}

const setLoading = (loading: boolean): void => {
  if (!root || !toggle) return
  if (loading) {
    root.removeAttribute('data-charpente-ready')
    root.setAttribute('data-charpente-loading', '')
    root.setAttribute('aria-busy', 'true')
    root.setAttribute('inert', '')
  } else {
    root.removeAttribute('data-charpente-loading')
    root.removeAttribute('aria-busy')
    root.removeAttribute('inert')
    root.setAttribute('data-charpente-ready', '')
    window.setTimeout(() => root.removeAttribute('data-charpente-ready'), 280)
  }
  toggle.textContent = loading ? 'Afficher le contenu' : 'Afficher le squelette'
  if (status) status.textContent = loading ? 'Chargement en cours' : 'Contenu chargé'
}

for (const control of [theme, delay, stagger, ...motions]) {
  control?.addEventListener('input', applySettings)
  control?.addEventListener('change', applySettings)
}

toggle?.addEventListener('click', () => {
  setLoading(root?.hasAttribute('data-charpente-loading') !== true)
})

applySettings()
