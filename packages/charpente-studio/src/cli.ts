import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { startStudio } from './server'

const USAGE = 'usage: charpente-studio [--dir themes] [--port 4400]'
const DEFAULT_PORT = 4400

const { values } = parseArgs({
  options: {
    dir: { type: 'string', default: 'themes' },
    port: { type: 'string', default: String(DEFAULT_PORT) },
    help: { type: 'boolean', short: 'h' },
  },
})

if (values.help) {
  console.log(USAGE)
  process.exit(0)
}

const port = Number(values.port)
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  console.error(`charpente-studio: invalid port "${values.port}"`)
  console.error(USAGE)
  process.exit(1)
}

const server = await startStudio({
  root: process.cwd(),
  dir: values.dir,
  port,
  clientPath: fileURLToPath(new URL('./client.js', import.meta.url)),
})
const address = server.address()
console.log(`charpente-studio: http://127.0.0.1:${typeof address === 'object' && address ? address.port : port}`)
