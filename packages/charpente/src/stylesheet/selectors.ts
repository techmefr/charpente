import { PAINT_TYPES, type PaintType } from '../types'

export const LOADING = '[data-charpente-loading]'

const MEDIA = 'img, svg, video, canvas, picture, iframe'
const CONTROL = 'button, input, select, textarea'
const OUTSIDE_BLOCK = ':not([data-charpente-block] *)'
const CONTROL_PARTS = ':not(:is(button, [role="button"], select, fieldset, legend, [role="combobox"]) *)'

export const TYPE_SELECTORS: Record<PaintType, string> = {
  text: `:not(:has(*)):not([data-charpente-block]):not(:is(${MEDIA}, ${CONTROL})):not(:is(${MEDIA}) *)${CONTROL_PARTS}${OUTSIDE_BLOCK}`,
  media: `:is(${MEDIA})${OUTSIDE_BLOCK}`,
  control: `:is(${CONTROL})${OUTSIDE_BLOCK}`,
  block: '[data-charpente-block]',
}

export const within = (scopes: string[], selector: string): string =>
  scopes.map((scope) => `${scope} ${selector}`).join(',\n')

export const CAPTURED_SLOTS = ['[data-charpente-capture]::before', '[data-charpente-capture]::after']

export const capturedLeaves = (scope: string): string => CAPTURED_SLOTS.map((slot) => `${scope} ${slot}`).join(',\n')

export const allLeaves =(scope: string): string =>
  PAINT_TYPES.map((type) => `${scope} ${TYPE_SELECTORS[type]}`).join(',\n')
