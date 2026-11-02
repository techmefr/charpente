import type { Page } from 'playwright'
import { ROOT } from './settings.ts'

export const paintProblems = (page: Page): Promise<string[]> =>
  page.evaluate((rootSelector) => {
    const root = document.querySelector(rootSelector) as Element
    const problems: string[] = []
    const label = (element: Element): string =>
      `${element.tagName.toLowerCase()}${element.className ? `.${String(element.className).split(' ')[0]}` : ''}`

    for (const element of [root, ...root.querySelectorAll('*')]) {
      for (const node of element.childNodes) {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue
        const fill = getComputedStyle(element).getPropertyValue('-webkit-text-fill-color')
        if (fill !== 'rgba(0, 0, 0, 0)') problems.push(`visible text in ${label(element)}: "${node.textContent.trim().slice(0, 24)}"`)
      }
    }

    const skipped = ['option', 'br', 'source', 'script', 'style']
    for (const element of root.querySelectorAll('*')) {
      const tag = element.tagName.toLowerCase()
      if (element.children.length > 0 || skipped.includes(tag)) continue
      if (tag !== 'svg' && element.closest('svg')) continue
      if (element.parentElement?.closest('button, [role="button"], select, fieldset, legend, [role="combobox"]')) continue
      if (element instanceof HTMLInputElement && ['checkbox', 'radio'].includes(element.type)) continue
      const rect = element.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) continue
      const style = getComputedStyle(element)
      if (!style.backgroundImage.includes('gradient')) problems.push(`unpainted leaf ${label(element)}`)
      if (style.visibility === 'hidden') problems.push(`hidden leaf ${label(element)}`)
    }
    return problems
  }, ROOT)
