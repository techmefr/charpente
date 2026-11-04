import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { emptyState, themeSource } from '../src/generator'
import { startStudio } from '../src/server'

let server: Server
let root = ''
let base = ''

const post = (body: unknown, headers: Record<string, string> = {}) =>
  fetch(`${base}/api/themes`, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) })

beforeAll(async () => {
  root = mkdtempSync(join(tmpdir(), 'charpente-generator-'))
  const clientPath = join(root, 'client.js')
  writeFileSync(clientPath, 'console.log("client")')
  writeFileSync(join(root, 'themes.js'), 'console.log("themes")')
  server = await startStudio({ root, dir: 'themes', port: 0, clientPath })
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})

afterAll(() => {
  server.close()
})

describe('generator saves', () => {
  it('serves the lazy theme script', async () => {
    expect(await (await fetch(`${base}/themes.js`)).text()).toBe('console.log("themes")')
  })

  it('writes the file the generator shows', async () => {
    const state = { ...emptyState(), name: 'wave' }
    state.leaves.text.radius = '999px'
    const response = await post({ state })
    expect(response.status).toBe(200)
    expect(readFileSync(join(root, 'themes', 'wave', 'theme.ts'), 'utf8')).toBe(themeSource(state))
  })

  it('still refuses to overwrite unless asked', async () => {
    const state = { ...emptyState(), name: 'twice' }
    expect((await post({ state })).status).toBe(200)
    expect((await post({ state })).status).toBe(409)
    expect((await post({ state, overwrite: true })).status).toBe(200)
  })

  it('saves a layered shape and refuses an unknown one', async () => {
    const state = { ...emptyState(), name: 'gifted' }
    state.leaves.block.shape = 'gift'
    expect((await post({ state })).status).toBe(200)
    expect(readFileSync(join(root, 'themes', 'gifted', 'theme.ts'), 'utf8')).toContain("shape: 'gift'")
    const unknown = { ...emptyState(), name: 'unknown-shape' }
    unknown.leaves.block.shape = '../../etc'
    expect((await post({ state: unknown })).status).toBe(400)
    expect(existsSync(join(root, 'themes', 'unknown-shape'))).toBe(false)
  })

  it('refuses a state that could break out of the css or the folder', async () => {
    const injected = { ...emptyState(), name: 'bad' }
    injected.leaves.text.custom = 'red} body{display:none'
    expect((await post({ state: injected })).status).toBe(400)
    expect((await post({ state: { ...emptyState(), name: '../outside' } })).status).toBe(400)
    expect(existsSync(join(root, 'themes', 'bad'))).toBe(false)
    expect(existsSync(join(root, 'outside'))).toBe(false)
  })

  it('keeps the host, origin and content-type guards on the new payload', async () => {
    const state = { ...emptyState(), name: 'guarded' }
    expect((await post({ state }, { origin: 'http://evil.example' })).status).toBe(403)
    const text = await fetch(`${base}/api/themes`, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: '{}' })
    expect(text.status).toBe(415)
    expect(existsSync(join(root, 'themes', 'guarded'))).toBe(false)
  })

  it('still answers 413 over the body limit with the generator payload', async () => {
    const state = { ...emptyState(), name: 'huge' }
    state.leaves.text.custom = `linear-gradient(${'red,'.repeat(40_000)} blue)`
    expect((await post({ state })).status).toBe(413)
  })
})
