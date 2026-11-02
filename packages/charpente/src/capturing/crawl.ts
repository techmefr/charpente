export const DEFAULT_ROUTE_LIMIT = 30

const COLLECT_LINKS = `[...document.querySelectorAll('a[href]')].map((link) => link.href)`
const FILE_EXTENSION = /\.(?!html?$)[a-z0-9]{2,5}$/i

export interface CrawlPage {
  goto: (url: string, options: { waitUntil: 'networkidle' }) => Promise<unknown>
  waitForTimeout: (milliseconds: number) => Promise<void>
  evaluate: <Result>(script: string) => Promise<Result>
}

const routeOf = (href: string, origin: URL): string | undefined => {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return undefined
  }
  if (url.origin !== origin.origin || FILE_EXTENSION.test(url.pathname)) return undefined
  return `${url.pathname}${url.search}`
}

export const crawlRoutes = async (page: CrawlPage, origin: string, limit: number, wait: number): Promise<string[]> => {
  const base = new URL(origin)
  const found = ['/']
  for (let index = 0; index < found.length; index++) {
    await page.goto(new URL(found[index] as string, base).toString(), { waitUntil: 'networkidle' })
    await page.waitForTimeout(wait)
    for (const href of await page.evaluate<string[]>(COLLECT_LINKS)) {
      const route = routeOf(href, base)
      if (route && !found.includes(route) && found.length < limit) found.push(route)
    }
  }
  return found
}
