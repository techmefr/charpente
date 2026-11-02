import { LOADING, allLeaves } from './selectors'

const MAX_STAGGER_INDEX = 16

export const baseCss = (): string => {
  const hidden = [
    'color: transparent',
    '-webkit-text-fill-color: transparent',
    'text-shadow: none',
    'box-shadow: none',
    'border-color: transparent',
    'caret-color: transparent',
    'user-select: none',
    'pointer-events: none',
  ].join(';\n  ')
  const staggerIndices = Array.from(
    { length: MAX_STAGGER_INDEX },
    (_, index) => `${LOADING} :nth-child(${index + 1}) { --charpente-i: ${index + 1}; }`,
  ).join('\n')
  return [
    `${LOADING} * {\n  -webkit-text-fill-color: transparent;\n  text-shadow: none;\n  text-decoration-color: transparent !important;\n}`,
    `${LOADING} :is(td, th) {\n  box-shadow: none !important;\n  border-color: transparent !important;\n}`,
    `${LOADING} :is(tr, thead, tbody, tfoot, table) {\n  border-color: transparent !important;\n  box-shadow: none !important;\n}`,
    `${LOADING} :is(button, [role="button"], input, select, textarea, fieldset) {\n  border-color: transparent !important;\n}`,
    `${allLeaves(LOADING)} {\n  ${hidden};\n}`,
    `${LOADING} [data-charpente-block] > *,\n${LOADING} svg * {\n  visibility: hidden;\n}`,
    `${LOADING} img {\n  content: url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");\n}`,
    `${LOADING} ::placeholder {\n  color: transparent;\n}`,
    `charpente-loader {\n  display: block;\n}`,
    staggerIndices,
  ].join('\n')
}
