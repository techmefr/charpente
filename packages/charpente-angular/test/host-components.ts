import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
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
export class HostComponent {
  readonly loading = signal(true)
  readonly theme = signal<string | undefined>(undefined)
  readonly motion = signal<string | string[] | undefined>(undefined)
  readonly delay = signal<number | undefined>(undefined)
  readonly stagger = signal<number | undefined>(undefined)
}

@Component({
  imports: [CharpenteDirective],
  template: `<div data-testid="reveal" [charpente]="loading()" [reveal]="1000" [revealMs]="300"></div>`,
})
export class RevealComponent {
  readonly loading = signal(true)
}

@Component({
  imports: [CharpenteDirective],
  template: `<div charpente></div>`,
})
export class BareAttributeComponent {}

@Component({
  imports: [CharpenteDirective],
  template: `<div [charpente]="true" scope="page"></div>`,
})
export class PageScopeComponent {}

export const setup = () => {
  const fixture = TestBed.createComponent(HostComponent)
  fixture.detectChanges()
  const element = fixture.nativeElement.querySelector('[data-testid="host"]') as HTMLElement
  return { fixture, element, host: fixture.componentInstance }
}
