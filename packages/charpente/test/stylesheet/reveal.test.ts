import { describe, expect, it } from 'vitest'
import { compile } from '../../src'

describe('compile reveal', () => {
  it('reveals nested levels one step after the other once the area is ready', () => {
    const { css } = compile({ reveal: 1000 })
    expect(css).toMatch(/\[data-charpente-ready\] > \* \{\s*animation: charpente-reveal-in 260ms ease-out calc\(var\(--charpente-reveal, 1000ms\) \* 0\) both/)
    expect(css).toMatch(/\[data-charpente-ready\] > \* > \* \{\s*animation: charpente-reveal-in 260ms ease-out calc\(var\(--charpente-reveal, 1000ms\) \* 1\) both/)
    expect(css).toContain('[data-charpente-ready] > * > * > * > * > * > *')
  })

  it('keeps nested levels still unless the area asks for a reveal step', () => {
    const { css } = compile()
    expect(css).toContain('[data-charpente-ready][data-charpente-reveal] > * > * {')
    expect(css).not.toMatch(/\[data-charpente-ready\] > \* > \* \{/)
  })

  it('stops the nested reveal under reduced motion', () => {
    const { css } = compile({ reveal: 500 })
    const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
    expect(reduced).toMatch(/\[data-charpente-ready\] > \* > \*,\s*\[data-charpente-ready\] > \* > \* > \*/)
    expect(reduced).toMatch(/> \* > \* > \* > \* > \* > \* \{\s*animation: none;/)
  })
})
