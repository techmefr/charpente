const READY_MS = 280

const targets = document.querySelectorAll<HTMLElement>('[data-loop]')
const pauseButtons = document.querySelectorAll<HTMLButtonElement>('[data-loop-pause]')
let paused = false

const setLoading = (element: HTMLElement, loading: boolean): void => {
  if (loading) {
    element.removeAttribute('data-charpente-ready')
    element.setAttribute('data-charpente-loading', '')
    element.setAttribute('aria-busy', 'true')
    element.setAttribute('inert', '')
    return
  }
  element.removeAttribute('data-charpente-loading')
  element.removeAttribute('aria-busy')
  element.removeAttribute('inert')
  element.setAttribute('data-charpente-ready', '')
  window.setTimeout(() => element.removeAttribute('data-charpente-ready'), READY_MS)
}

const announce = (element: HTMLElement, loading: boolean): void => {
  const selector = element.dataset.loopStatus
  const region = selector ? document.querySelector(selector) : null
  if (region) region.textContent = loading ? 'Loading' : 'Content loaded'
}

const run = (element: HTMLElement): void => {
  const onMs = Number(element.dataset.loopOn ?? 2800)
  const offMs = Number(element.dataset.loopOff ?? 2200)
  let loading = true

  const step = (): void => {
    if (!paused) {
      loading = !loading
      setLoading(element, loading)
      announce(element, loading)
    }
    window.setTimeout(step, loading ? onMs : offMs)
  }

  window.setTimeout(step, onMs)
}

for (const element of targets) run(element)

for (const button of pauseButtons) {
  button.addEventListener('click', () => {
    paused = !paused
    for (const other of pauseButtons) {
      other.setAttribute('aria-pressed', String(paused))
      other.textContent = paused ? 'Resume the loop' : 'Pause the loop'
    }
  })
}
