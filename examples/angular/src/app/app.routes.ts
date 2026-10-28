import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: 'simple', loadComponent: () => import('./simple.page').then((m) => m.SimplePage) },
  { path: 'complex', loadComponent: () => import('./complex.page').then((m) => m.ComplexPage) },
  { path: '', pathMatch: 'full', redirectTo: 'simple' },
]
