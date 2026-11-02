import type { LoadingOptions, LoadingScope } from './attributes'
import { revealWindow } from './attributes'
import { configuredScope, setLoading } from './dom'

const OBSERVED = ['loading', 'theme', 'motion', 'delay', 'stagger', 'reveal', 'reveal-ms', 'scope']
const DEFAULT_REVEAL_MS = 260

const number = (value: string | null): number | undefined => {
  if (value === null || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export const defineCharpenteLoader = (name = 'charpente-loader'): void => {
  if (typeof customElements === 'undefined' || customElements.get(name)) return

  customElements.define(
    name,
    class CharpenteLoader extends HTMLElement {
      static observedAttributes = OBSERVED

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

      private options(): LoadingOptions {
        const motion = this.getAttribute('motion')
        const scope = this.getAttribute('scope')
        return {
          loading: this.loading,
          theme: this.getAttribute('theme') ?? undefined,
          motion: motion === null ? undefined : motion.split(/\s+/).filter(Boolean),
          delay: number(this.getAttribute('delay')),
          stagger: number(this.getAttribute('stagger')),
          reveal: number(this.getAttribute('reveal')),
          scope: scope === 'page' || scope === 'element' ? scope : undefined,
          ready: this.ready,
        }
      }

      private startReveal(): void {
        clearTimeout(this.timer)
        this.ready = true
        const revealMs = number(this.getAttribute('reveal-ms')) ?? DEFAULT_REVEAL_MS
        this.timer = setTimeout(() => {
          this.ready = false
          this.sync()
        }, revealWindow(revealMs, number(this.getAttribute('reveal'))))
      }

      private release(): void {
        if (this.appliedScope === 'page') setLoading(this, { loading: false, scope: 'page' })
        else setLoading(this, { loading: false, scope: 'element' })
        this.appliedScope = undefined
      }

      private sync(): void {
        if (!this.isConnected) return
        const options = this.options()
        const scope = options.scope ?? configuredScope(this)
        if (this.appliedScope !== undefined && this.appliedScope !== scope) this.release()
        this.appliedScope = scope
        setLoading(this, { ...options, scope })
      }
    },
  )
}

defineCharpenteLoader()
