#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { createJiti } from 'jiti'
import { readBones, runCapture } from './capturing'
import { compile } from './stylesheet'
import { discoverThemes } from './discovery'
import { themeAt } from './schedule'
import type { CharpenteConfig } from './types'

const USAGE = [
  'usage: charpente build [--config charpente.config.ts] [--out charpente.css]',
  '       charpente theme [--config charpente.config.ts] [--date YYYY-MM-DD]',
  '       charpente capture [--url http://localhost:3000] [--config charpente.config.ts] [--watch]',
  '                         [--breakpoints 375,768,1280] [--wait 500] [--out charpente.bones.json]',
  '                         [--cdp http://localhost:9222] [--env-file .env]',
].join('\n')

const parse = () => {
  try {
    return parseArgs({
      allowPositionals: true,
      options: {
        config: { type: 'string', default: 'charpente.config.ts' },
        out: { type: 'string' },
        date: { type: 'string' },
        url: { type: 'string' },
        breakpoints: { type: 'string' },
        wait: { type: 'string' },
        cdp: { type: 'string' },
        'env-file': { type: 'string' },
        watch: { type: 'boolean' },
        help: { type: 'boolean', short: 'h' },
      },
    })
  } catch (error) {
    console.error(`charpente: ${(error as Error).message.split('.')[0]}`)
    console.error(USAGE)
    process.exit(1)
  }
}

const { positionals, values } = parse()

if (values.help) {
  console.log(USAGE)
  process.exit(0)
}

const command = positionals[0]
if (command !== 'build' && command !== 'theme' && command !== 'capture') {
  console.error(USAGE)
  process.exit(1)
}

if (values['env-file']) process.loadEnvFile(resolve(process.cwd(), values['env-file']))

const configPath = resolve(process.cwd(), values.config)
let config: CharpenteConfig = {}

if (existsSync(configPath)) {
  const jiti = createJiti(import.meta.url, { moduleCache: false })
  const loaded = await jiti.import<{ default?: CharpenteConfig } | CharpenteConfig>(configPath)
  config = 'default' in loaded && loaded.default ? loaded.default : (loaded as CharpenteConfig)
}

const discovered = await discoverThemes(process.cwd(), config.themesDir)
config = { ...config, themes: { ...discovered, ...config.themes } }

if (command === 'capture') {
  try {
    await runCapture(process.cwd(), config, values, (message) => console.log(`charpente: ${message}`))
  } catch (error) {
    console.error((error as Error).message)
    process.exit(1)
  }
  process.exit(0)
}

config = { ...config, bones: config.bones ?? readBones(process.cwd(), config) }

const { css, warnings } = compile(config)
for (const warning of warnings) console.warn(warning)

if (command === 'theme') {
  const date = values.date ? new Date(`${values.date}T12:00:00Z`) : new Date()
  console.log(themeAt(config, date))
} else {
  const out = values.out ?? 'charpente.css'
  const outPath = resolve(process.cwd(), out)
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, css)
  console.log(`charpente: wrote ${out}`)
}
