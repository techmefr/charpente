import { Component } from '@angular/core'
import { CharpenteDirective } from 'charpente-angular'
import { isLoading } from './loading-state'

@Component({
  selector: 'app-complex',
  imports: [CharpenteDirective],
  preserveWhitespaces: true,
  templateUrl: '../generated/complex.html',
})
export class ComplexPage {
  readonly loading = isLoading()
}
