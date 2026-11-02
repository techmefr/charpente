import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

export const htmlIncludes = (): Plugin => ({
  name: 'html-includes',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) =>
      html.replace(/<include src="([^"]+)"><\/include>/g, (_match, source: string) =>
        readFileSync(resolve(__dirname, source), 'utf8').trimEnd(),
      ),
  },
})
