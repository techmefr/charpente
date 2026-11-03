import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { request } from 'node:http'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { MAX_BODY, startStudio } from '../src/server'
import { listThemes } from '../src/store'

let server: Server
let root = ''
let base = ''

const post = (body: unknown) =>
  fetch(`${base}/api/themes`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })

const port = (): number => (server.address() as AddressInfo).port

const raw = (headers: Record<string, string>): Promise<number> =>
  new Promise((done, fail) => {
    const call = request({ host: '127.0.0.1', port: port(), path: '/api/themes', headers }, (response) => {
      response.resume()
      done(response.statusCode ?? 0)
    })
    call.on('error', fail)
    call.end()
  })

beforeAll(async () => {
  root = mkdtempSync(join(tmpdir(), 'charpente-studio-'))
  const clientPath = join(root, 'client.js')
  writeFileSync(clientPath, 'console.log("client")')
  server = await startStudio({ root, dir: 'themes', port: 0, clientPath })
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})

afterAll(() => {
  server.close()
})

describe('studio server', () => {
  it('serves the page and the client script', async () => {
    const page = await (await fetch(base)).text()
    expect(page).toContain('Charpente studio')
    expect(page).toContain('<script src="/client.js">')
    expect(await (await fetch(`${base}/client.js`)).text()).toBe('console.log("client")')
  })

  it('saves a theme folder and lists it', async () => {
    const response = await post({ name: 'ocean', colors: ['#112233', '#445566'], pattern: 'stripes', radius: 6, scale: 1.1 })
    expect(response.status).toBe(200)
    expect(readFileSync(join(root, 'themes', 'ocean', 'theme.ts'), 'utf8')).toContain("pattern: 'stripes'")
    expect(await (await fetch(`${base}/api/themes`)).json()).toEqual(['ocean'])
  })

  it('refuses an invalid theme and a name that escapes the folder', async () => {
    const bad = await post({ name: '../outside', colors: ['#112233', '#445566'], pattern: 'dots', radius: 6, scale: 1 })
    expect(bad.status).toBe(400)
    expect(existsSync(join(root, 'outside'))).toBe(false)
    expect(((await bad.json()) as { error: string }).error).toContain('name')
  })

  it('refuses a body that is not json', async () => {
    const response = await fetch(`${base}/api/themes`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: 'nope' })
    expect(response.status).toBe(400)
  })

  it('refuses a foreign host', async () => {
    expect(await raw({ host: 'evil.example' })).toBe(403)
    expect(await raw({ host: '127.0.0.1:1' })).toBe(403)
    expect(await raw({ host: `localhost:${port()}` })).toBe(200)
  })

  it('refuses a foreign origin', async () => {
    expect(await raw({ origin: 'http://evil.example' })).toBe(403)
    expect(await raw({ origin: `http://127.0.0.1:${port()}` })).toBe(200)
  })

  it('refuses a post that is not json', async () => {
    const response = await fetch(`${base}/api/themes`, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: '{}' })
    expect(response.status).toBe(415)
  })

  it('refuses to overwrite a theme unless asked', async () => {
    const theme = { name: 'keep', colors: ['#112233', '#445566'], pattern: 'dots', radius: 6, scale: 1 }
    expect((await post(theme)).status).toBe(200)
    expect((await post({ ...theme, pattern: 'grid' })).status).toBe(409)
    expect(readFileSync(join(root, 'themes', 'keep', 'theme.ts'), 'utf8')).toContain("pattern: 'dots'")
    expect((await post({ ...theme, pattern: 'grid', overwrite: true })).status).toBe(200)
    expect(readFileSync(join(root, 'themes', 'keep', 'theme.ts'), 'utf8')).toContain("pattern: 'grid'")
  })

  it('refuses a null radius', async () => {
    const response = await post({ name: 'nullr', colors: ['#112233', '#445566'], pattern: 'dots', radius: null, scale: 1 })
    expect(response.status).toBe(400)
  })

  it('answers 413 over the body limit', async () => {
    const response = await post({ name: 'big', padding: 'x'.repeat(MAX_BODY) })
    expect(response.status).toBe(413)
  })

  it('sets security headers on the page', async () => {
    const response = await fetch(base)
    expect(response.headers.get('content-security-policy')).toBe("default-src 'self'; style-src 'unsafe-inline'; img-src data:; frame-ancestors 'none'")
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
  })

  it('rejects when the port is taken', async () => {
    await expect(startStudio({ root, dir: 'themes', port: port(), clientPath: join(root, 'client.js') })).rejects.toThrow()
  })

  it('refuses a folder outside the root', async () => {
    await expect(startStudio({ root, dir: '../outside', port: 0, clientPath: join(root, 'client.js') })).rejects.toThrow('inside')
  })

  it('lists nothing for a folder without themes', () => {
    mkdirSync(join(root, 'empty', 'sub'), { recursive: true })
    expect(listThemes(root, 'empty')).toEqual([])
  })

  it('answers 404 elsewhere', async () => {
    expect((await fetch(`${base}/unknown`)).status).toBe(404)
  })
})
