import { createComponent, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import type { CharpenteProps } from './charpente-props'

const SCREEN_READER_ONLY = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  'white-space': 'nowrap',
} as const

export const screenReaderStatus = (own: CharpenteProps): JSX.Element | undefined =>
  own.loading && own.label
    ? createComponent(Dynamic, {
        component: 'span',
        role: 'status',
        style: SCREEN_READER_ONLY,
        children: own.label,
      })
    : undefined
