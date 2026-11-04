import type { PaintType, ShapeDef, ShapeRole } from 'charpente/lite'
import { ROLES, ROLE_TITLES, SHAPE_LIBRARY, SHAPE_TITLES, defaultRoles } from '../shapes'
import { PREVIEW_THEME } from './preview'
import { h } from './dom'
import type { Control, Store } from './store'

const FILLED: PaintType[] = ['media', 'block']
const SVG = 'http://www.w3.org/2000/svg'

const swatchOf = (shape: ShapeDef, roles: readonly ShapeRole[]): SVGSVGElement => {
  const svg = document.createElementNS(SVG, 'svg')
  svg.setAttribute('viewBox', `0 0 ${shape.viewBox[0]} ${shape.viewBox[1]}`)
  svg.setAttribute('class', 'gen-shape-swatch')
  svg.setAttribute('aria-hidden', 'true')
  shape.layers.forEach((layer, index) => {
    const path = document.createElementNS(SVG, 'path')
    path.setAttribute('d', layer.path)
    path.setAttribute('class', `gen-role-${roles[index] ?? layer.role}`)
    svg.append(path)
  })
  return svg
}

const PREVIEW_ELEMENTS: Record<PaintType, () => HTMLElement> = {
  block: () => h('div', { 'data-charpente-block': true }),
  media: () => h('img', { alt: '' }),
  text: () => h('span'),
  control: () => h('button', { type: 'button', tabindex: -1 }),
}

const rolesOf = (name: string, roles: readonly ShapeRole[]): ShapeRole[] => (roles.length > 0 ? [...roles] : defaultRoles(name))

const roleRow = (store: Store, shape: ShapeDef, index: number, current: ShapeRole): HTMLElement => {
  const select = h('select', { id: `gen-layer-${index}`, 'aria-label': `Role of ${shape.layers[index]?.name ?? `layer ${index + 1}`}` })
  for (const role of ROLES) select.append(h('option', { value: role, selected: role === current }, ROLE_TITLES[role]))
  select.addEventListener('change', () =>
    store.edit((leaf) => {
      const next = rolesOf(leaf.shape, leaf.roles)
      next[index] = select.value as ShapeRole
      leaf.roles = next
    }),
  )
  return h('li', { class: 'gen-layer' }, h('label', { for: select.id }, shape.layers[index]?.name ?? `Layer ${index + 1}`), select)
}

export const layeredControl = (store: Store): Control => {
  const tiles = ['', ...Object.keys(SHAPE_LIBRARY)].map((name) => {
    const shape = SHAPE_LIBRARY[name]
    const visual = shape ? swatchOf(shape, defaultRoles(name)) : h('span', { class: 'gen-swatch gen-swatch-fill', 'aria-hidden': 'true' })
    const button = h('button', { type: 'button', class: 'gen-tile', 'aria-pressed': 'false' }, visual, h('span', {}, name ? SHAPE_TITLES[name] : 'None'))
    button.addEventListener('click', () => store.edit((leaf, type) => (name && store.target === 'all' && !FILLED.includes(type) ? undefined : Object.assign(leaf, { shape: name, roles: [] }))))
    return { name, button }
  })
  const layers = h('ul', { class: 'gen-layers', 'aria-label': 'Layer roles' })
  const stage = h('div', { class: 'gen-shape-preview', 'data-charpente-loading': true, 'data-charpente-theme': PREVIEW_THEME, 'aria-hidden': 'true' })
  const root = h(
    'div',
    { class: 'gen-field' },
    h('span', { class: 'gen-label' }, 'Layered shapes'),
    h('div', { class: 'gen-tiles', role: 'group', 'aria-label': 'Layered shapes' }, ...tiles.map((tile) => tile.button)),
    h('p', { class: 'gen-note' }, 'Theme paint layers take the fill chosen below, the others use the accent colors. With all leaves selected, the shape goes on media and block.'),
    stage,
    layers,
  )
  let drawn = ''
  return {
    root,
    refresh: () => {
      const leaf = store.target === 'all' ? store.state.leaves.block : store.leaf()
      for (const tile of tiles) tile.button.setAttribute('aria-pressed', String(tile.name === leaf.shape))
      const kind: PaintType = store.target === 'all' ? 'block' : store.target
      const key = `${kind}:${leaf.shape}`
      const roles = rolesOf(leaf.shape, leaf.roles)
      if (key === drawn) {
        layers.querySelectorAll('select').forEach((select, index) => (select.value = roles[index] as string))
        return
      }
      drawn = key
      const base = SHAPE_LIBRARY[leaf.shape]
      stage.hidden = !base
      stage.replaceChildren(PREVIEW_ELEMENTS[kind]())
      layers.replaceChildren(...(base ? base.layers.map((_, index) => roleRow(store, base, index, roles[index] as ShapeRole)) : []))
    },
  }
}
