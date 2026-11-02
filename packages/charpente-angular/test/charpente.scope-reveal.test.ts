import { TestBed } from '@angular/core/testing'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PageScopeComponent, RevealComponent } from './host-components'

describe('CharpenteDirective scope', () => {
  it('applies the loading state to the page when the scope is page', () => {
    const fixture = TestBed.createComponent(PageScopeComponent)
    fixture.detectChanges()
    const element = fixture.nativeElement.querySelector('div') as HTMLElement
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(true)
    expect(element.hasAttribute('data-charpente-loading')).toBe(false)
    fixture.destroy()
    expect(document.documentElement.hasAttribute('data-charpente-loading')).toBe(false)
  })
})

describe('CharpenteDirective reveal', () => {
  afterEach(() => vi.useRealTimers())

  it('marks the host ready for every nested step after loading ends, then clears it', () => {
    vi.useFakeTimers()
    const fixture = TestBed.createComponent(RevealComponent)
    fixture.detectChanges()
    const element = fixture.nativeElement.querySelector('[data-testid="reveal"]') as HTMLElement
    expect(element.getAttribute('data-charpente-reveal')).toBe('')
    expect(element.style.getPropertyValue('--charpente-reveal')).toBe('1000ms')
    fixture.componentInstance.loading.set(false)
    fixture.detectChanges()
    TestBed.flushEffects()
    fixture.detectChanges()
    expect(element.hasAttribute('data-charpente-ready')).toBe(true)
    vi.advanceTimersByTime(300 + 1000 * 5 - 1)
    fixture.detectChanges()
    expect(element.hasAttribute('data-charpente-ready')).toBe(true)
    vi.advanceTimersByTime(2)
    fixture.detectChanges()
    expect(element.hasAttribute('data-charpente-ready')).toBe(false)
  })
})
