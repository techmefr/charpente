import { TestBed } from '@angular/core/testing'
import { describe, expect, it } from 'vitest'
import { BareAttributeComponent, setup } from './host-components'

describe('CharpenteDirective', () => {
  it('sets loading attributes while loading', () => {
    const { element } = setup()
    expect(element.getAttribute('data-charpente-loading')).toBe('')
    expect(element.getAttribute('aria-busy')).toBe('true')
    expect(element.hasAttribute('inert')).toBe(true)
  })

  it('removes every attribute when not loading', () => {
    const { fixture, element, host } = setup()
    host.loading.set(false)
    fixture.detectChanges()
    expect(element.hasAttribute('data-charpente-loading')).toBe(false)
    expect(element.hasAttribute('aria-busy')).toBe(false)
    expect(element.hasAttribute('inert')).toBe(false)
  })

  it('treats a bare charpente attribute as loading', () => {
    const fixture = TestBed.createComponent(BareAttributeComponent)
    fixture.detectChanges()
    const element = fixture.nativeElement.querySelector('div') as HTMLElement
    expect(element.hasAttribute('data-charpente-loading')).toBe(true)
  })

  it('binds and unbinds the theme', () => {
    const { fixture, element, host } = setup()
    host.theme.set('cyberpunk')
    fixture.detectChanges()
    expect(element.getAttribute('data-charpente-theme')).toBe('cyberpunk')
    host.theme.set(undefined)
    fixture.detectChanges()
    expect(element.hasAttribute('data-charpente-theme')).toBe(false)
  })

  it('keeps theme and timing when loading ends', () => {
    const { fixture, element, host } = setup()
    host.theme.set('solid')
    host.delay.set(50)
    host.loading.set(false)
    fixture.detectChanges()
    expect(element.getAttribute('data-charpente-theme')).toBe('solid')
    expect(element.style.getPropertyValue('--charpente-delay')).toBe('50ms')
    expect(element.hasAttribute('data-charpente-loading')).toBe(false)
  })
})
