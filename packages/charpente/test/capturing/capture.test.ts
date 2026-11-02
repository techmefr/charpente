import { mkdtempSync, readFileSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { captureBones } from '../../src/capturing'
import { bonesPath, readBones, writeBones } from '../../src/capturing/store'

const PAGE = `<!doctype html><style>
body { margin: 0; font: 16px/20px sans-serif }
.hero { width: 50%; padding: 10px }
.hero p { margin: 0 0 10px; width: 200px }
.hero img { display: block; width: 80px; height: 80px; border-radius: 40px }
</style>
<section class="hero" data-charpente-block data-charpente-capture="hero">
  <p>Welcome to the team</p>
  <img alt="" width="80" height="80" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
  <button type="button">Join</button>
  <div data-charpente-block><span>Inside a block</span></div>
</section>`

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
  server = createServer((_, response) => response.writeHead(200, { 'content-type': 'text/html' }).end(PAGE))
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done))
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})

afterAll(() => {
  server.close()
})

describe('capture in a real browser', () => {
  it('measures the text, image and button of a zone at every breakpoint', async (context) => {
    if (!available) return context.skip()
    const data = await captureBones(origin, { routes: ['/'], breakpoints: [400, 900], wait: 0 })
    expect(Object.keys(data.hero ?? {})).toEqual(['400', '900'])
    const small = data.hero?.['400']
    const large = data.hero?.['900']
    expect(small?.width).toBe(220)
    expect(large?.width).toBe(470)
    expect(small?.bones).toHaveLength(4)
    expect(small?.bones[0]).toMatchObject({ x: 10, y: 10, width: 200, height: 20 })
    expect(small?.bones[1]).toMatchObject({ width: 80, height: 80, radius: 40 })
  })
})

describe('bones store', () => {
  it('writes the bones to the configured file and reads them back', () => {
    const root = mkdtempSync(join(tmpdir(), 'charpente-'))
    const data = { hero: { '400': { width: 1, height: 1, bones: [] } } }
    expect(readBones(root, {})).toBeUndefined()
    const file = writeBones(root, { capture: { routes: ['/'], out: 'bones/zones.json' } }, data)
    expect(file).toBe(bonesPath(root, { capture: { routes: ['/'], out: 'bones/zones.json' } }))
    expect(JSON.parse(readFileSync(file, 'utf8'))).toEqual(data)
    expect(readBones(root, { capture: { routes: ['/'], out: 'bones/zones.json' } })).toEqual(data)
  })
})
