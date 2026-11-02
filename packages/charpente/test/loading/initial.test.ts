import { describe, expect, it } from 'vitest'
import { DEFAULT_INITIAL_GRACE, initialGrace, initialScript, withInitialLoading } from '../../src/loading'

describe('initial loading', () => {
  it('is off unless the option is set', () => {
    expect(initialGrace(undefined)).toBeUndefined()
    expect(initialGrace(false)).toBeUndefined()
    expect(initialGrace(true)).toBe(DEFAULT_INITIAL_GRACE)
    expect(initialGrace(1500)).toBe(1500)
  })

  it('marks the page as loading in the served html', () => {
    const html = withInitialLoading('<!doctype html><html lang="en"><head></head><body></body></html>')
    expect(html).toContain('<html lang="en" data-charpente-initial data-charpente-loading aria-busy="true">')
    expect(withInitialLoading('<html><body></body></html>')).toContain('<html data-charpente-initial')
  })

  it('releases the page after the load event only when nothing took over', () => {
    const script = initialScript(1200)
    expect(script).toContain("addEventListener('load'")
    expect(script).toContain(',1200)')
    expect(script).toContain("hasAttribute('data-charpente-initial')")
  })
})
