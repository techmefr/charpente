import { Suspense, defineComponent, h } from 'vue'
import { Charpente } from './charpente'

export const CharpenteSuspense = defineComponent({
  name: 'CharpenteSuspense',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(Suspense, null, {
        default: () => h(Charpente, { ...attrs, loading: false }, slots.default),
        fallback: () => h(Charpente, { ...attrs, loading: true }, slots.fallback),
      })
  },
})
