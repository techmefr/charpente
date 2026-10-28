import { Component } from '@angular/core'
import { CharpenteDirective } from 'charpente-angular'
import { isLoading } from './loading-state'

@Component({
  selector: 'app-simple',
  imports: [CharpenteDirective],
  preserveWhitespaces: true,
  templateUrl: '../generated/simple.html',
})
export class SimplePage {
  readonly loading = isLoading()
}
