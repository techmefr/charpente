import { readFileSync } from 'node:fs'
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'
import { studioPage } from './page'
import { ThemeExistsError, listThemes, saveTheme, themeBase } from './store'
import { validateForm } from './theme-file'

export interface StudioOptions {
  root: string
  dir: string
  port: number
  clientPath: string
}

export const MAX_BODY = 10_000

const NOSNIFF = { 'x-content-type-options': 'nosniff' }
const PAGE_HEADERS = {
  ...NOSNIFF,
  'content-security-policy': "default-src 'self'; style-src 'unsafe-inline'; img-src data:; frame-ancestors 'none'",
}

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

const readBody = (request: IncomingMessage): Promise<string> =>
  new Promise((done, fail) => {
    const chunks: Buffer[] = []
    let size = 0
    request.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY) {
        fail(new HttpError(413, 'charpente-studio: request too large'))
        request.pause()
        return
      }
      chunks.push(chunk)
    })
    request.on('end', () => done(Buffer.concat(chunks).toString('utf8')))
    request.on('error', fail)
  })

const send = (response: ServerResponse, status: number, type: string, body: string, headers: Record<string, string> = {}): void => {
  response.writeHead(status, { 'content-type': `${type}; charset=utf-8`, ...headers }).end(body)
}

const sendJson = (response: ServerResponse, status: number, body: unknown): void => send(response, status, 'application/json', JSON.stringify(body), NOSNIFF)

const guard = (request: IncomingMessage, port: number): void => {
  const host = request.headers.host
  if (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`) throw new HttpError(403, 'charpente-studio: forbidden host')
  const origin = request.headers.origin
  if (origin !== undefined && origin !== `http://${host}`) throw new HttpError(403, 'charpente-studio: forbidden origin')
  if (request.method === 'POST' && !/^application\/json\s*(;|$)/i.test(request.headers['content-type'] ?? '')) {
    throw new HttpError(415, 'charpente-studio: content-type must be application/json')
  }
}

const save = async (request: IncomingMessage, response: ServerResponse, { root, dir }: StudioOptions): Promise<void> => {
  const input: unknown = JSON.parse(await readBody(request))
  const overwrite = typeof input === 'object' && input !== null && (input as Record<string, unknown>).overwrite === true
  sendJson(response, 200, { file: saveTheme(root, dir, validateForm(input), overwrite) })
}

const handle = async (request: IncomingMessage, response: ServerResponse, options: StudioOptions, port: number): Promise<void> => {
  guard(request, port)
  const { pathname } = new URL(request.url ?? '/', 'http://localhost')
  if (request.method === 'GET' && pathname === '/') return send(response, 200, 'text/html', studioPage(), PAGE_HEADERS)
  if (request.method === 'GET' && pathname === '/client.js') return send(response, 200, 'text/javascript', readFileSync(options.clientPath, 'utf8'), NOSNIFF)
  if (request.method === 'GET' && pathname === '/api/themes') return sendJson(response, 200, listThemes(options.root, options.dir))
  if (request.method === 'POST' && pathname === '/api/themes') return save(request, response, options)
  send(response, 404, 'text/plain', 'not found', NOSNIFF)
}

const statusOf = (error: unknown): number => {
  if (error instanceof HttpError) return error.status
  if (error instanceof ThemeExistsError) return 409
  if (error instanceof SyntaxError || (error instanceof Error && error.message.startsWith('charpente-studio:'))) return 400
  return 500
}

export const startStudio = (options: StudioOptions): Promise<Server> =>
  new Promise((done, fail) => {
    try {
      themeBase(options.root, options.dir)
    } catch (error) {
      fail(error)
      return
    }
    const server = createServer((request, response) => {
      const port = (server.address() as AddressInfo).port
      handle(request, response, options, port).catch((error: unknown) => {
        if (response.headersSent) return void response.destroy()
        const status = statusOf(error)
        sendJson(response, status, { error: status === 500 ? 'charpente-studio: internal error' : (error as Error).message })
      })
    })
    server.once('error', fail)
    server.listen(options.port, '127.0.0.1', () => {
      server.off('error', fail)
      done(server)
    })
  })
