import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { describe, expect, it } from 'vitest'
import { CharpenteDirective } from '../src'

@Component({
  imports: [CharpenteDirective],
  template: `<div
    data-testid="host"
    [charpente]="loading()"
    [theme]="theme()"
    [motion]="motion()"
    [delay]="delay()"
    [stagger]="stagger()"
  ></div>`,
})
class HostComponent {
  readonly loading = signal(true)
  readonly theme = signal<string | undefined>(undefined)
  readonly motion = signal<string | string[] | undefined>(undefined)
  readonly delay = signal<number | undefined>(undefined)
  readonly stagger = signal<number | undefined>(undefined)
}

@Component({
  imports: [CharpenteDirective],
  template: `<div charpente></div>`,
})
class BareAttributeComponent {}

const setup = () => {
  const fixture = TestBed.createComponent(HostComponent)
  fixture.detectChanges()
  const element = fixture.nativeElement.querySelector('[data-testid="host"]') as HTMLElement
  return { fixture, element, host: fixture.componentInstance }
}

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
