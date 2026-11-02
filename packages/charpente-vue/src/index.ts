import {
  Fragment,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect,
  type CSSProperties,
  type PropType,
} from 'vue'
import { loadingAttributes, motionAttribute, revealWindow, type LoadingScope } from 'charpente'
import { configuredScope, setLoading } from 'charpente/dom'

const SCREEN_READER_ONLY: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
}

export { motionAttribute }

export const Charpente = defineComponent({
  name: 'Charpente',
  inheritAttrs: false,
  props: {
    loading: { type: Boolean, default: false },
    tag: { type: String, default: 'div' },
    theme: { type: String, default: undefined },
    motion: { type: [String, Array] as PropType<string | string[]>, default: undefined },
    delay: { type: Number, default: undefined },
    stagger: { type: Number, default: undefined },
    reveal: { type: Number, default: undefined },
    scope: { type: String as PropType<LoadingScope>, default: undefined },
    label: { type: String, default: '' },
    revealMs: { type: Number, default: 260 },
  },
  setup(props, { slots, attrs }) {
    const ready = ref(false)
    const element = ref<HTMLElement | null>(null)
    const page = ref(props.scope === 'page')
    let timer: ReturnType<typeof setTimeout> | undefined

    watch(
      () => props.loading,
      (now, before) => {
        if (!before || now) return
        ready.value = true
        timer = setTimeout(() => {
          ready.value = false
        }, revealWindow(props.revealMs, props.reveal))
      },
    )

    watch(
      () => props.scope,
      (scope) => {
        if (scope !== undefined) page.value = scope === 'page'
      },
    )

    onMounted(() => {
      if (props.scope === undefined && element.value) page.value = configuredScope(element.value) === 'page'
    })

    watchEffect((onCleanup) => {
      const target = element.value
      if (!page.value || !target) return
      setLoading(target, {
        loading: props.loading,
        theme: props.theme,
        motion: props.motion,
        delay: props.delay,
        stagger: props.stagger,
        reveal: props.reveal,
        ready: ready.value,
        scope: 'page',
      })
      onCleanup(() => setLoading(target, { loading: false, scope: 'page' }))
    })

    onBeforeUnmount(() => clearTimeout(timer))

    return () => {
      const { attributes, style } = loadingAttributes({
        loading: page.value ? false : props.loading,
        theme: page.value ? undefined : props.theme,
        motion: page.value ? undefined : props.motion,
        delay: page.value ? undefined : props.delay,
        stagger: page.value ? undefined : props.stagger,
        reveal: page.value ? undefined : props.reveal,
      })

      const root = h(
        props.tag,
        {
          ...attrs,
          ...attributes,
          ref: element,
          'data-charpente-ready': ready.value && !page.value ? '' : undefined,
          style: attrs.style || Object.keys(style).length > 0 ? [attrs.style, style] : undefined,
        },
        slots.default?.(),
      )

      if (!props.loading || !props.label) return root
      return h(Fragment, [root, h('span', { role: 'status', style: SCREEN_READER_ONLY }, props.label)])
    }
  },
})
