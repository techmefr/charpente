type Child = Node | string | false | null | undefined

export const h = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  attrs: Record<string, string | number | boolean | undefined> = {},
  ...children: Child[]
): HTMLElementTagNameMap[Tag] => {
  const element = document.createElement(tag)
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue
    if (name === 'class') element.className = String(value)
    else element.setAttribute(name, value === true ? '' : String(value))
  }
  for (const child of children) if (child) element.append(child)
  return element
}

let counter = 0

export const uid = (prefix: string): string => `${prefix}-${++counter}`

export const labelled = (text: string, control: HTMLElement, hint?: string): HTMLElement => {
  const id = control.id || uid('gen-field')
  control.id = id
  return h('div', { class: 'gen-field' }, h('label', { for: id }, text), control, hint ? h('small', { id: `${id}-hint` }, hint) : null)
}

export const section = (title: string, open: boolean, ...body: Child[]): { root: HTMLDetailsElement; body: HTMLElement } => {
  const content = h('div', { class: 'gen-section-body' }, ...body)
  return { root: h('details', { class: 'gen-section', open }, h('summary', {}, title), content), body: content }
}

export const optionList = (select: HTMLSelectElement, options: readonly (readonly [string, string])[]): HTMLSelectElement => {
  for (const [value, label] of options) select.append(h('option', { value }, label))
  return select
}
