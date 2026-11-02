import { describe, expect, it } from 'vitest'
import { compile } from '../../src'

describe('compile leaf painting', () => {
  it('hides the text of every element, including mixed content', () => {
    expect(compile().css).toMatch(/\[data-charpente-loading\] \* \{\s*-webkit-text-fill-color: transparent/)
  })

  it('keeps the padding of text leaves out of the paint', () => {
    expect(compile().css).toContain('background-clip: content-box !important')
  })

  it('hides the drawing inside svg so only the svg box is painted', () => {
    expect(compile().css).toMatch(/\[data-charpente-loading\] svg \* \{\s*visibility: hidden/)
  })

  it('neutralises the host background color on every leaf', () => {
    expect(compile().css).toContain('background-color: transparent !important')
  })

  it('hides children of a block so only the block is painted', () => {
    expect(compile().css).toContain('[data-charpente-block] > *')
  })
})

describe('ui library resilience', () => {
  it('hides text decorations such as link underlines', () => {
    expect(compile().css).toContain('text-decoration-color: transparent !important')
  })

  it('removes frames from table cells and rows', () => {
    const { css } = compile()
    expect(css).toMatch(/\[data-charpente-loading\] :is\(td, th\) \{\s*box-shadow: none !important/)
    expect(css).toMatch(/:is\(tr, thead, tbody, tfoot, table\) \{\s*border-color: transparent !important/)
  })

  it('keeps the inner parts of controls out of the text paint', () => {
    expect(compile().css).toContain(':not(:is(button, [role="button"], select, fieldset, legend, [role="combobox"]) *)')
  })
})
