import {
  Fragment,
  defineComponent,
  h,
  onBeforeUnmount,
  ref,
  watch,
  type CSSProperties,
  type PropType,
} from 'vue'
import { loadingAttributes, motionAttribute } from 'charpente'

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
    label: { type: String, default: '' },
    revealMs: { type: Number, default: 260 },
  },
  setup(props, { slots, attrs }) {
    const ready = ref(false)
    let timer: ReturnType<typeof setTimeout> | undefined

    watch(
      () => props.loading,
      (now, before) => {
        if (!before || now) return
        ready.value = true
        timer = setTimeout(() => {
          ready.value = false
        }, props.revealMs)
      },
    )

    onBeforeUnmount(() => clearTimeout(timer))

    return () => {
      const { attributes, style } = loadingAttributes({
        loading: props.loading,
        theme: props.theme,
        motion: props.motion,
        delay: props.delay,
        stagger: props.stagger,
      })

      const root = h(
        props.tag,
        {
          ...attrs,
          ...attributes,
          'data-charpente-ready': ready.value ? '' : undefined,
          style: attrs.style || Object.keys(style).length > 0 ? [attrs.style, style] : undefined,
        },
        slots.default?.(),
      )

      if (!props.loading || !props.label) return root
      return h(Fragment, [root, h('span', { role: 'status', style: SCREEN_READER_ONLY }, props.label)])
    }
  },
})
