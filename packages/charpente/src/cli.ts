#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { createJiti } from 'jiti'
import { compile } from './compile'
import { themeAt } from './schedule'
import type { CharpenteConfig } from './types'

const USAGE = [
  'usage: charpente build [--config charpente.config.ts] [--out charpente.css]',
  '       charpente theme [--config charpente.config.ts] [--date YYYY-MM-DD]',
].join('\n')

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    config: { type: 'string', default: 'charpente.config.ts' },
    out: { type: 'string', default: 'charpente.css' },
    date: { type: 'string' },
  },
})

const command = positionals[0]
if (command !== 'build' && command !== 'theme') {
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

if (command === 'theme') {
  const date = values.date ? new Date(`${values.date}T12:00:00Z`) : new Date()
  console.log(themeAt(config, date))
} else {
  const outPath = resolve(process.cwd(), values.out)
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, css)
  console.log(`charpente: wrote ${values.out}`)
}
