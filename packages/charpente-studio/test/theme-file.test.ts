import { compile } from 'charpente'
import { describe, expect, it } from 'vitest'
import { formToTheme, themeSource, validateForm } from '../src/theme-file'

const valid = { name: 'ocean', colors: ['#E5E7EB', '#d1d5db'], pattern: 'dots', radius: 12, scale: 1.2 }

describe('theme form', () => {
  it('accepts a complete form and lowers the colors', () => {
    expect(validateForm(valid)).toEqual({ ...valid, colors: ['#e5e7eb', '#d1d5db'] })
  })

  it.each([
    [{ ...valid, name: '../escape' }, 'name'],
    [{ ...valid, name: 'Upper' }, 'name'],
    [{ ...valid, colors: ['red', '#000000'] }, 'color'],
    [{ ...valid, colors: ['#000000'] }, 'two colors'],
    [{ ...valid, pattern: 'zigzag' }, 'pattern'],
    [{ ...valid, radius: -1 }, 'radius'],
    [{ ...valid, scale: 9 }, 'scale'],
    ['text', 'object'],
  ])('rejects %j', (input, message) => {
    expect(() => validateForm(input)).toThrow(message)
  })
})

describe('theme source', () => {
  it('writes a short-format theme file', () => {
    expect(themeSource(validateForm(valid))).toBe(
      [
        "import { defineTheme } from 'charpente'",
        '',
        'export default defineTheme({',
        "  colors: ['#e5e7eb', '#d1d5db'],",
        "  pattern: 'dots',",
        "  radius: '12px',",
        '  scale: 1.2,',
        '})',
        '',
      ].join('\n'),
    )
  })

  it('compiles to a stylesheet that uses the chosen colors', () => {
    const { css } = compile({ themes: { studio: formToTheme(validateForm(valid)) }, defaultTheme: 'studio' })
    expect(css).toContain('#e5e7eb')
    expect(css).toContain('12px')
  })
})
