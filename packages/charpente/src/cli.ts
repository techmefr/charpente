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

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const fail = (message: string): never => {
  console.error(`charpente: ${message}`)
  process.exit(1)
}

if (values.date !== undefined && (!DATE_PATTERN.test(values.date) || Number.isNaN(Date.parse(values.date)))) {
  fail(`--date "${values.date}" must look like YYYY-MM-DD`)
}

const configPath = resolve(process.cwd(), values.config)
let config: CharpenteConfig = {}

try {
  if (existsSync(configPath)) {
    const jiti = createJiti(import.meta.url, { moduleCache: false })
    const loaded = await jiti.import<{ default?: CharpenteConfig } | CharpenteConfig>(configPath)
    config = 'default' in loaded && loaded.default ? loaded.default : (loaded as CharpenteConfig)
  }

  if (command === 'theme') {
    const date = values.date ? new Date(`${values.date}T12:00:00Z`) : new Date()
    console.log(themeAt(config, date))
  } else {
    const { css, warnings } = compile(config)
    for (const warning of warnings) console.warn(warning)
    const outPath = resolve(process.cwd(), values.out)
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, css)
    console.log(`charpente: wrote ${values.out}`)
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error))
}
