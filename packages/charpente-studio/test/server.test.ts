import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { startStudio } from '../src/server'

let server: Server
let root = ''
let base = ''

const post = (body: unknown) =>
  fetch(`${base}/api/themes`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })

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
    const response = await fetch(`${base}/api/themes`, { method: 'POST', body: 'nope' })
    expect(response.status).toBe(400)
  })

  it('answers 404 elsewhere', async () => {
    expect((await fetch(`${base}/unknown`)).status).toBe(404)
  })
})
