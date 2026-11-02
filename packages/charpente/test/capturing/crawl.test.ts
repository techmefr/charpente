import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { chromium } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { captureBones } from '../../src/capturing'
import { crawlRoutes } from '../../src/capturing/crawl'

const zone = (name: string): string =>
  `<section data-charpente-block data-charpente-capture="${name}"><p>${name}</p></section>`

const PAGES: Record<string, string> = {
  '/': `<a href="/team">Team</a><a href="/blog?page=2">Blog</a><a href="/logo.png">Logo</a><a href="https://example.org/">Out</a><a href="#top">Top</a>${zone('home')}`,
  '/team': `<a href="/">Home</a><a href="/team/jane">Jane</a>${zone('team')}`,
  '/team/jane': zone('jane'),
  '/blog': zone('blog'),
}

let server: Server
let origin = ''
let available = true

beforeAll(async () => {
  try {
    const browser = await chromium.launch()
    await browser.close()
  } catch {
    available = false
  }
  server = createServer((request, response) => {
    const path = new URL(request.url ?? '/', 'http://localhost').pathname
    const page = PAGES[path]
    response.writeHead(page ? 200 : 404, { 'content-type': 'text/html' }).end(page ?? '')
  })
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done))
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})

afterAll(() => {
  server.close()
})

describe('route scan', () => {
  it('follows the internal links and ignores files, other sites and anchors', async (context) => {
    if (!available) return context.skip()
    const browser = await chromium.launch()
    const page = await browser.newPage()
    const routes = await crawlRoutes(page, origin, 30, 0)
    await browser.close()
    expect(routes).toEqual(['/', '/team', '/blog?page=2', '/team/jane'])
  })

  it('stops at the route limit', async (context) => {
    if (!available) return context.skip()
    const browser = await chromium.launch()
    const page = await browser.newPage()
    const routes = await crawlRoutes(page, origin, 2, 0)
    await browser.close()
    expect(routes).toEqual(['/', '/team'])
  })

  it('captures every discovered page when no route is configured', async (context) => {
    if (!available) return context.skip()
    const data = await captureBones(origin, { breakpoints: [400], wait: 0 })
    expect(Object.keys(data).sort()).toEqual(['blog', 'home', 'jane', 'team'])
  })
})
