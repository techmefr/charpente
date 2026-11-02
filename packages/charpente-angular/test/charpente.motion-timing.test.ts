import { describe, expect, it } from 'vitest'
import { setup } from './host-components'

describe('CharpenteDirective motion and timing', () => {
  it('binds a single motion', () => {
    const { fixture, element, host } = setup()
    host.motion.set('shimmer')
    fixture.detectChanges()
    expect(element.getAttribute('data-charpente-motion')).toBe('shimmer')
  })

  it('sorts and joins several motions', () => {
    const { fixture, element, host } = setup()
    host.motion.set(['pulse', 'shimmer'])
    fixture.detectChanges()
    expect(element.getAttribute('data-charpente-motion')).toBe('pulse shimmer')
  })

  it('maps an empty motion list to none', () => {
    const { fixture, element, host } = setup()
    host.motion.set([])
    fixture.detectChanges()
    expect(element.getAttribute('data-charpente-motion')).toBe('none')
  })

  it('binds delay and stagger as custom properties', () => {
    const { fixture, element, host } = setup()
    host.delay.set(120)
    host.stagger.set(40)
    fixture.detectChanges()
    expect(element.style.getPropertyValue('--charpente-delay')).toBe('120ms')
    expect(element.style.getPropertyValue('--charpente-stagger')).toBe('40ms')
    host.delay.set(undefined)
    host.stagger.set(undefined)
    fixture.detectChanges()
    expect(element.style.getPropertyValue('--charpente-delay')).toBe('')
    expect(element.style.getPropertyValue('--charpente-stagger')).toBe('')
  })
})
