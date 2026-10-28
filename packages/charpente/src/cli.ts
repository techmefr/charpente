#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { createJiti } from 'jiti'
import { compile } from './compile'
import type { CharpenteConfig } from './types'

const USAGE = 'usage: charpente build [--config charpente.config.ts] [--out charpente.css]'

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    config: { type: 'string', default: 'charpente.config.ts' },
    out: { type: 'string', default: 'charpente.css' },
  },
})

if (positionals[0] !== 'build') {
  console.error(USAGE)
  process.exit(1)
}

const configPath = resolve(process.cwd(), values.config)
let config: CharpenteConfig = {}

if (existsSync(configPath)) {
  const jiti = createJiti(import.meta.url, { moduleCache: false })
  const loaded = await jiti.import<{ default?: CharpenteConfig } | CharpenteConfig>(configPath)
  config = 'default' in loaded && loaded.default ? loaded.default : (loaded as CharpenteConfig)
}

const { css, warnings } = compile(config)
for (const warning of warnings) console.warn(warning)

const outPath = resolve(process.cwd(), values.out)
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, css)
console.log(`charpente: wrote ${values.out}`)
