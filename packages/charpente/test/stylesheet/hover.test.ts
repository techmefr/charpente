import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import type { BonesData, CharpenteConfig, ThemeDef } from '../../src'

const zone: BonesData = { card: { '1280': { width: 10, height: 10, bones: [{ x: 0, y: 0, width: 10, height: 10, radius: 1, kind: 'text' }] } } }

const css = (theme: ThemeDef, extra: CharpenteConfig = {}): string =>
  compile({ themes: { lively: theme }, defaultTheme: 'lively', ...extra }).css

describe('hover rules', () => {
  it('generates no hover rule for a theme without hover', () => {
    expect(compile().css).not.toContain(':hover')
    expect(compile().css).not.toContain('(hover: hover)')
  })

  it('writes a :hover rule for each leaf type', () => {
    const source = css({ extends: 'solid', hover: { text: { fill: 'red' }, media: { fill: 'blue' }, control: { style: { opacity: '.5' } }, block: { radius: '2px' } } })
    expect(source).toMatch(/\[data-charpente-block\]:hover \{[^}]*border-radius: 2px/)
    expect(source).toMatch(/:is\(button, input, select, textarea\):not\(\[data-charpente-block\] \*\):hover \{[^}]*opacity: \.5/)
    expect(source).toMatch(/:hover \{\s*background-color: transparent !important;\s*background-image: var\(--charpente-shine-layer, none\), red !important/)
    expect(source).toMatch(/:hover \{[^}]*blue/)
  })

  it('only writes the types that declare a hover', () => {
    const source = css({ extends: 'solid', hover: { block: { radius: '2px' } } })
    expect(source.match(/:hover \{/g)).toHaveLength(1)
  })

  it('enables pointer events on the leaves of a hover theme only inside the hover media', () => {
    const source = css({ extends: 'solid', hover: 'strong' })
    expect(source).toMatch(/@media \(hover: hover\) \{[^@]*pointer-events: auto/)
    expect(compile().css).not.toContain('pointer-events: auto')
  })

  it('adds the theme scope so it beats the resting paint', () => {
    expect(css({ extends: 'solid', hover: 'strong' })).toContain('[data-charpente-loading][data-charpente-theme="lively"] [data-charpente-block]:hover')
  })

  it('covers the default theme scope', () => {
    expect(css({ extends: 'solid', hover: 'strong' })).toContain('[data-charpente-loading]:not([data-charpente-theme]) [data-charpente-block]:hover')
  })
})

describe('hover in capture mode', () => {
  it('hovers the captured zone and paints its pseudo-elements', () => {
    const source = css({ extends: 'solid', hover: 'strong' }, { bones: zone })
    expect(source).toContain('[data-charpente-capture]:hover::before')
    expect(source).toContain('[data-charpente-capture]:hover::after')
  })

  it('does not target pseudo-elements without captured zones', () => {
    expect(css({ extends: 'solid', hover: 'strong' })).not.toContain('[data-charpente-capture]:hover')
  })
})

describe('hover transition', () => {
  it('transitions with the hover duration variable and a default of 150ms', () => {
    expect(css({ extends: 'solid', hover: 'strong' })).toContain('transition-duration: var(--charpente-hover-ms, 150ms)')
  })

  it('writes the transition only when motion is not reduced', () => {
    const source = css({ extends: 'solid', hover: 'strong' })
    const reduced = source.indexOf('@media (hover: hover) and (prefers-reduced-motion: no-preference)')
    expect(reduced).toBeGreaterThan(-1)
    expect(source.slice(0, reduced)).not.toContain('transition-duration')
  })
})

describe('hover motion', () => {
  it('pauses the animation of the hovered leaves', () => {
    const source = css({ extends: 'solid', hoverMotion: 'pause' })
    expect(source).toMatch(/\[data-charpente-block\]:hover \{\s*animation-play-state: paused/)
  })

  it('speeds up the animation but keeps the reveal untouched', () => {
    const source = css({ extends: 'solid', hoverMotion: 'faster' })
    expect(source).toMatch(/:hover \{\s*animation-duration: 0s, var\(--charpente-hover-fast, 600ms\)/)
  })

  it('writes nothing for none', () => {
    expect(css({ extends: 'solid', hoverMotion: 'none' })).not.toContain('animation-play-state')
  })

  it('combines with a hover paint in the same rule', () => {
    const source = css({ extends: 'solid', hover: { block: { radius: '2px' } }, hoverMotion: 'pause' })
    expect(source).toMatch(/\[data-charpente-block\]:hover \{[^}]*border-radius: 2px;\s*animation-play-state: paused/)
  })

  it('pauses captured pseudo-elements too', () => {
    expect(css({ extends: 'solid', hoverMotion: 'pause' }, { bones: zone })).toMatch(/\[data-charpente-capture\]:hover::before[^{]*\{\s*animation-play-state: paused/)
  })
})
