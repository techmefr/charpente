import { readFileSync } from 'node:fs'
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import { studioPage } from './page'
import { listThemes, saveTheme } from './store'
import { validateForm } from './theme-file'

export interface StudioOptions {
  root: string
  dir: string
  port: number
  clientPath: string
}

const MAX_BODY = 10_000

const readBody = (request: IncomingMessage): Promise<string> =>
  new Promise((done, fail) => {
    let body = ''
    request.on('data', (chunk: Buffer) => {
      body += chunk
      if (body.length > MAX_BODY) request.destroy(new Error('charpente-studio: request too large'))
    })
    request.on('end', () => done(body))
    request.on('error', fail)
  })

const send = (response: ServerResponse, status: number, type: string, body: string): void => {
  response.writeHead(status, { 'content-type': `${type}; charset=utf-8` }).end(body)
}

const sendJson = (response: ServerResponse, status: number, body: unknown): void => send(response, status, 'application/json', JSON.stringify(body))

const save = async (request: IncomingMessage, response: ServerResponse, { root, dir }: StudioOptions): Promise<void> => {
  try {
    const form = validateForm(JSON.parse(await readBody(request)))
    sendJson(response, 200, { file: saveTheme(root, dir, form) })
  } catch (error) {
    sendJson(response, 400, { error: (error as Error).message })
  }
}

export const startStudio = (options: StudioOptions): Promise<Server> => {
  const server = createServer((request, response) => {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost')
    if (request.method === 'GET' && pathname === '/') return send(response, 200, 'text/html', studioPage())
    if (request.method === 'GET' && pathname === '/client.js') return send(response, 200, 'text/javascript', readFileSync(options.clientPath, 'utf8'))
    if (request.method === 'GET' && pathname === '/api/themes') return sendJson(response, 200, listThemes(options.root, options.dir))
    if (request.method === 'POST' && pathname === '/api/themes') return void save(request, response, options)
    return send(response, 404, 'text/plain', 'not found')
  })
  return new Promise((done) => server.listen(options.port, '127.0.0.1', () => done(server)))
}
