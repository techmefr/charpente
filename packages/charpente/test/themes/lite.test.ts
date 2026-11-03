import { describe, expect, it } from 'vitest'
import { compile as fullCompile } from '../../src'
import { compile, nativeTheme } from '../../src/lite'
import { cyberpunk, frost, glass } from '../../src/theme-exports'

describe('lite compile', () => {
  it('knows the solid theme without any other builtin theme', () => {
    const { css } = compile()
    expect(css).toContain('[data-charpente-loading]')
    expect(css).not.toContain('cyberpunk')
    expect(css).not.toContain('vegas')
  })

  it('compiles a theme imported from charpente/themes', () => {
    const { css } = compile({ themes: { cyberpunk }, defaultTheme: 'cyberpunk' })
    expect(css).toContain('#16435a')
  })

  it('gives the same css as the full compile for the same themes', () => {
    const config = { themes: { cyberpunk, glass, frost }, include: ['cyberpunk', 'glass', 'frost'] }
    const full = fullCompile({ ...config, themes: {} })
    expect(compile(config).css).toBe(full.css)
  })

  it('lets a user theme extend an imported one by name', () => {
    const { css } = compile({ themes: { glass, mine: { extends: 'glass', tokens: { base: '#abcdef' } } }, defaultTheme: 'mine' })
    expect(css).toContain('#abcdef')
  })

  it('names the missing theme and where to import it from', () => {
    expect(() => compile({ defaultTheme: 'cyberpunk' })).toThrow(/unknown theme "cyberpunk".*charpente\/themes/)
    expect(() => compile({ include: ['vegas'] })).toThrow(/unknown theme "vegas".*charpente\/themes/)
    expect(() => compile({ schedule: [{ from: '12-01', to: '12-31', theme: 'neon' }] })).toThrow(/unknown theme "neon"/)
  })
})

describe('lite native theme', () => {
  it('resolves solid and a theme object given in themes', () => {
    expect(nativeTheme('solid').radius).toBe(6)
    expect(nativeTheme('cyberpunk', { cyberpunk }).radius).toBe(3)
  })

  it('rejects a builtin theme that was not imported', () => {
    expect(() => nativeTheme('cyberpunk')).toThrow(/charpente\/themes/)
  })
})
