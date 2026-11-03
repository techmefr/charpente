import { Suspense, defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'
import { Charpente } from './charpente'

const { loading: _loading, ...suspenseProps } = Charpente.props

const PendingMarker = defineComponent({
  name: 'CharpentePendingMarker',
  emits: ['pending'],
  setup(_, { slots, emit }) {
    onMounted(() => emit('pending', true))
    onBeforeUnmount(() => emit('pending', false))
    return () => slots.default?.()
  },
})

export const CharpenteSuspense = defineComponent({
  name: 'CharpenteSuspense',
  inheritAttrs: false,
  props: suspenseProps,
  setup(props, { slots, attrs }) {
    const pending = ref(false)
    return () =>
      h(Charpente, { ...attrs, ...props, loading: pending.value }, () =>
        h(Suspense, null, {
          default: () => slots.default?.(),
          fallback: () => h(PendingMarker, { onPending: (value: boolean) => (pending.value = value) }, slots.fallback),
        }),
      )
  },
})
