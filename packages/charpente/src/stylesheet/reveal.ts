import { MAX_REVEAL_DEPTH } from '../loading'
import { LOADING, allLeaves } from './selectors'

const READY = '[data-charpente-ready]'

export const revealCss = (reveal: number): string => {
  const step = `var(--charpente-reveal, ${reveal}ms)`
  const deeper = reveal > 0 ? READY : `${READY}[data-charpente-reveal]`
  const levels = Array.from({ length: MAX_REVEAL_DEPTH }, (_, depth) => ({
    depth,
    selector: `${depth === 0 ? READY : deeper}${' > *'.repeat(depth + 1)}`,
  }))
  return [
    ...levels.map(
      ({ depth, selector }) =>
        `${selector} {\n  animation: charpente-reveal-in 260ms ease-out calc(${step} * ${depth}) both;\n}`,
    ),
    `@media (prefers-reduced-motion: reduce) {`,
    `  ${allLeaves(LOADING).replace(/\n/g, '\n  ')} {\n    animation: none !important;\n    --charpente-shine-layer: none !important;\n  }`,
    `  ${levels.map(({ selector }) => selector).join(',\n  ')} {\n    animation: none;\n  }`,
    `}`,
  ].join('\n')
}
