import { inflateSync } from 'node:zlib'
import { chromium, type Page } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { bonesCss } from '../../src/bones'
import type { BonesData } from '../../src'

type Kind = 'block' | 'text' | 'media'

const AT: Record<Kind, number> = { block: 10, text: 40, media: 70 }
const COLORS: Record<Kind, number[]> = { block: [0, 255, 0], text: [255, 0, 0], media: [0, 0, 255] }

const PAINT = `[data-charpente-loading] [data-charpente-block] { background-image: linear-gradient(#0f0, #0f0) !important }
[data-charpente-loading] [data-charpente-capture]::before { background: #f00 }
[data-charpente-loading] [data-charpente-capture]::after { background: #00f }`

const dataOf = (kinds: Kind[]): BonesData => ({
  zone: {
    '1280': {
      width: 200,
      height: 100,
      bones: kinds.map((kind) => ({ x: 10, y: AT[kind], width: 100, height: 20, radius: 0, kind })),
    },
  },
})

const pixel = (png: Buffer): number[] => {
  const chunks: Buffer[] = []
  let offset = 8
  let channels = 3
  while (offset < png.length) {
    const length = png.readUInt32BE(offset)
    const type = png.toString('ascii', offset + 4, offset + 8)
    if (type === 'IHDR') channels = png[offset + 8 + 9] === 6 ? 4 : 3
    if (type === 'IDAT') chunks.push(png.subarray(offset + 8, offset + 8 + length))
    offset += 12 + length
  }
  return [...inflateSync(Buffer.concat(chunks)).subarray(1, 1 + channels)].slice(0, 3)
}

let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined
let page: Page

beforeAll(async () => {
  try {
    browser = await chromium.launch()
    page = await browser.newPage({ viewport: { width: 300, height: 200 } })
  } catch {
    browser = undefined
  }
})

afterAll(async () => {
  await browser?.close()
})

const colorAt = async (kinds: Kind[], at: Kind | 'none'): Promise<number[]> => {
  const style = `body{margin:0;background:#fff}${bonesCss(dataOf(kinds))}${PAINT}`
  await page.setContent(
    `<style>${style}</style><div data-charpente-loading><section data-charpente-block data-charpente-capture="zone" style="width:200px"></section></div>`,
  )
  const y = at === 'none' ? 95 : AT[at] + 10
  return pixel(await page.screenshot({ clip: { x: 20, y, width: 1, height: 1 } }))
}

describe('zone mask in a real browser', () => {
  const cases: [Kind[], Kind][] = [
    [['text'], 'text'],
    [['media'], 'media'],
    [['block'], 'block'],
    [['block', 'text', 'media'], 'block'],
    [['block', 'text', 'media'], 'text'],
    [['block', 'text', 'media'], 'media'],
  ]

  it.each(cases)('keeps the %j layers visible at the %s bone', async (kinds, at) => {
    if (!browser) return
    expect(await colorAt(kinds, at)).toEqual(COLORS[at])
  })

  it('leaves the area outside the bones empty', async (context) => {
    if (!browser) return context.skip()
    expect(await colorAt(['text'], 'none')).toEqual([255, 255, 255])
    expect(await colorAt(['block', 'text', 'media'], 'none')).toEqual([255, 255, 255])
  })
})
