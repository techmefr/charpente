import { defineComponent, h, onBeforeUnmount, ref, watch, type CSSProperties, type PropType } from 'vue'

const SCREEN_READER_ONLY: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
}

export const motionAttribute = (motion: string | string[] | undefined): string | undefined => {
  if (motion === undefined) return undefined
  const names = Array.isArray(motion) ? [...motion].sort() : [motion]
  return names.length === 0 ? 'none' : names.join(' ')
}

export const Charpente = defineComponent({
  name: 'Charpente',
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
  setup(props, { slots }) {
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
      const style: Record<string, string> = {}
      if (props.delay !== undefined) style['--charpente-delay'] = `${props.delay}ms`
      if (props.stagger !== undefined) style['--charpente-stagger'] = `${props.stagger}ms`

      return h(
        props.tag,
        {
          'data-charpente-loading': props.loading ? '' : undefined,
          'data-charpente-ready': ready.value ? '' : undefined,
          'data-charpente-theme': props.theme,
          'data-charpente-motion': motionAttribute(props.motion),
          'aria-busy': props.loading ? 'true' : undefined,
          style,
        },
        [
          h(
            'div',
            {
              'data-charpente-content': '',
              'aria-hidden': props.loading ? 'true' : undefined,
              style: { display: 'contents' },
            },
            slots.default?.(),
          ),
          props.loading && props.label
            ? h('span', { role: 'status', style: SCREEN_READER_ONLY }, props.label)
            : null,
        ],
      )
    }
  },
})
