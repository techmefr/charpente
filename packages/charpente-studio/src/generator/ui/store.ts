import { LEAVES, type GeneratorState, type LeafState } from '../state'

export type Target = 'all' | (typeof LEAVES)[number]

export interface Store {
  state: GeneratorState
  target: Target
  leaf: () => LeafState
  edit: (change: (leaf: LeafState) => void) => void
  change: (change: (state: GeneratorState) => void) => void
  replace: (state: GeneratorState) => void
  refresh: () => void
  register: (control: Control) => void
}

export interface Control {
  root: HTMLElement
  refresh: () => void
}

export const createStore = (initial: GeneratorState, onChange: () => void): Store => {
  const controls: Control[] = []
  const store: Store = {
    state: initial,
    target: 'all',
    leaf: () => store.state.leaves[store.target === 'all' ? 'text' : store.target],
    edit: (change) => {
      const targets = store.target === 'all' ? LEAVES : [store.target]
      for (const type of targets) change(store.state.leaves[type])
      store.change(() => undefined)
    },
    change: (change) => {
      change(store.state)
      store.refresh()
      onChange()
    },
    replace: (state) => {
      store.state = state
      store.refresh()
      onChange()
    },
    refresh: () => {
      for (const control of controls) control.refresh()
    },
    register: (control) => {
      controls.push(control)
    },
  }
  return store
}
