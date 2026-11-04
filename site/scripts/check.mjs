import { chromium } from 'playwright'
import { crawlPages } from './check/crawl-pages.mjs'
import { checkGallery } from './check/gallery-checks.mjs'
import { checkGenerator } from './check/generator-checks.mjs'
import { checkPlayground } from './check/playground-checks.mjs'
import { failures } from './check/reporting.mjs'
import { takeScreenshots } from './check/screenshots.mjs'

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })

await crawlPages(context)
await checkPlayground(context)
await checkGallery(context)
await checkGenerator(context)
await takeScreenshots(browser)

await browser.close()
if (failures.length > 0) {
  console.error(`${failures.length} failure(s)`)
  process.exit(1)
}
console.log('all good')
