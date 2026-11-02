import type { LoadingScope } from '../types'
import { revealWindow } from './attributes'
import { configuredScope, setLoading } from './dom'
import { DEFAULT_REVEAL_MS, OBSERVED_ATTRIBUTES, numberAttribute, optionsOf } from './element-options'

const ElementBase = (typeof HTMLElement === 'undefined' ? class {} : HTMLElement) as typeof HTMLElement

class CharpenteLoader extends ElementBase {
  static observedAttributes = OBSERVED_ATTRIBUTES

  private ready = false
  private timer: ReturnType<typeof setTimeout> | undefined
  private appliedScope: LoadingScope | undefined

  get loading(): boolean {
    return this.hasAttribute('loading')
  }

  set loading(value: boolean) {
    this.toggleAttribute('loading', value)
  }

  connectedCallback(): void {
    this.sync()
  }

  disconnectedCallback(): void {
    clearTimeout(this.timer)
    this.ready = false
    this.release()
  }

  attributeChangedCallback(name: string, before: string | null, after: string | null): void {
    if (name === 'loading' && before !== null && after === null) this.startReveal()
    this.sync()
  }

  private startReveal(): void {
    clearTimeout(this.timer)
    this.ready = true
    const revealMs = numberAttribute(this.getAttribute('reveal-ms')) ?? DEFAULT_REVEAL_MS
    this.timer = setTimeout(() => {
      this.ready = false
      this.sync()
    }, revealWindow(revealMs, numberAttribute(this.getAttribute('reveal'))))
  }

  private release(): void {
    if (this.appliedScope === 'page') setLoading(this, { loading: false, scope: 'page' })
    else setLoading(this, { loading: false, scope: 'element' })
    this.appliedScope = undefined
  }

  private sync(): void {
    if (!this.isConnected) return
    const options = optionsOf(this, this.ready)
    const scope = options.scope ?? configuredScope(this)
    if (this.appliedScope !== undefined && this.appliedScope !== scope) this.release()
    this.appliedScope = scope
    setLoading(this, { ...options, scope })
  }
}

export const defineCharpenteLoader = (name = 'charpente-loader'): void => {
  if (typeof customElements === 'undefined' || customElements.get(name)) return
  customElements.define(name, CharpenteLoader)
}

defineCharpenteLoader()
