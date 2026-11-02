import { DestroyRef, Directive, ElementRef, afterNextRender, computed, effect, inject, input, signal, untracked } from '@angular/core'
import { loadingAttributes, motionAttribute, revealWindow, type LoadingScope } from 'charpente'
import { configuredScope, setLoading } from 'charpente/dom'

export { motionAttribute }

@Directive({
  selector: '[charpente]',
  standalone: true,
  host: {
    '[attr.data-charpente-loading]': 'attributes()["data-charpente-loading"] ?? null',
    '[attr.aria-busy]': 'attributes()["aria-busy"] ?? null',
    '[attr.inert]': 'attributes()["inert"] ?? null',
    '[attr.data-charpente-theme]': 'attributes()["data-charpente-theme"] ?? null',
    '[attr.data-charpente-motion]': 'attributes()["data-charpente-motion"] ?? null',
    '[attr.data-charpente-reveal]': 'attributes()["data-charpente-reveal"] ?? null',
    '[attr.data-charpente-ready]': 'attributes()["data-charpente-ready"] ?? null',
    '[style.--charpente-delay]': 'style()["--charpente-delay"] ?? null',
    '[style.--charpente-stagger]': 'style()["--charpente-stagger"] ?? null',
    '[style.--charpente-reveal]': 'style()["--charpente-reveal"] ?? null',
  },
})
export class CharpenteDirective {
  readonly loading = input(false, {
    alias: 'charpente',
    transform: (value: boolean | string) => value === '' || value === true || value === 'true',
  })
  readonly theme = input<string>()
  readonly motion = input<string | string[]>()
  readonly delay = input<number>()
  readonly stagger = input<number>()
  readonly reveal = input<number>()
  readonly revealMs = input(260)
  readonly scope = input<LoadingScope>()

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly mounted = signal(false)
  private readonly configured = signal<LoadingScope>('element')
  private readonly ready = signal(false)
  private timer: ReturnType<typeof setTimeout> | undefined

  private readonly page = computed(() => (this.scope() ?? (this.mounted() ? this.configured() : 'element')) === 'page')

  private readonly resolved = computed(() =>
    loadingAttributes(
      this.page()
        ? { loading: false }
        : {
            loading: this.loading(),
            theme: this.theme(),
            motion: this.motion(),
            delay: this.delay(),
            stagger: this.stagger(),
            reveal: this.reveal(),
            ready: this.ready(),
          },
    ),
  )

  protected readonly attributes = computed(() => this.resolved().attributes)
  protected readonly style = computed(() => this.resolved().style)

  constructor() {
    let previous = this.loading()
    effect(() => {
      const now = this.loading()
      const wasLoading = previous
      previous = now
      if (!wasLoading || now) return
      untracked(() => {
        clearTimeout(this.timer)
        this.ready.set(true)
        this.timer = setTimeout(() => this.ready.set(false), revealWindow(this.revealMs(), this.reveal()))
      })
    })

    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer))

    afterNextRender(() => {
      this.configured.set(configuredScope(this.host.nativeElement))
      this.mounted.set(true)
    })

    effect((onCleanup) => {
      if (!this.page()) return
      const target = this.host.nativeElement
      setLoading(target, {
        loading: this.loading(),
        theme: this.theme(),
        motion: this.motion(),
        delay: this.delay(),
        stagger: this.stagger(),
        reveal: this.reveal(),
        ready: this.ready(),
        scope: 'page',
      })
      onCleanup(() => setLoading(target, { loading: false, scope: 'page' }))
    })
  }
}
