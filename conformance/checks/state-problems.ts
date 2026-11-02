import type { Page } from 'playwright'
import { ROOT } from './settings.ts'

export const stateProblems = (page: Page): Promise<string[]> =>
  page.evaluate((rootSelector) => {
    const root = document.querySelector(rootSelector) as HTMLElement
    const problems: string[] = []
    if (!root.hasAttribute('data-charpente-loading')) problems.push('root has no data-charpente-loading')
    if (root.getAttribute('aria-busy') !== 'true') problems.push('root has no aria-busy="true"')
    if (!root.hasAttribute('inert')) problems.push('root is not inert')
    return problems
  }, ROOT)
