import { Directive, computed, input } from '@angular/core'
import { loadingAttributes, motionAttribute } from 'charpente'

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
    '[style.--charpente-delay]': 'style()["--charpente-delay"] ?? null',
    '[style.--charpente-stagger]': 'style()["--charpente-stagger"] ?? null',
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

  private readonly resolved = computed(() =>
    loadingAttributes({
      loading: this.loading(),
      theme: this.theme(),
      motion: this.motion(),
      delay: this.delay(),
      stagger: this.stagger(),
    }),
  )

  protected readonly attributes = computed(() => this.resolved().attributes)
  protected readonly style = computed(() => this.resolved().style)
}
