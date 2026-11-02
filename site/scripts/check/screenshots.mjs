import { mkdirSync } from 'node:fs'
import { fail } from './reporting.mjs'
import { shotsDir, urlOf } from './site-urls.mjs'

const targets = ['', 'themes', 'playground', 'configuration', 'motions', 'create-a-theme', 'accessibility', 'calendar', 'getting-started']
const sizes = { desk: { width: 1280, height: 900 }, phone: { width: 390, height: 844 } }

const shootPage = async (shotContext, slug, label, scheme) => {
  const page = await shotContext.newPage()
  await page.goto(urlOf(slug), { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  if (overflow) fail(`${slug || '/'} ${label} ${scheme}: horizontal page scroll`)
  await page.screenshot({ path: `${shotsDir}/${slug || 'accueil'}-${label}-${scheme}.png`, fullPage: true })
  await page.close()
}

export const takeScreenshots = async (browser) => {
  if (!shotsDir) return
  mkdirSync(shotsDir, { recursive: true })
  for (const scheme of ['light', 'dark']) {
    for (const [label, viewport] of Object.entries(sizes)) {
      const shotContext = await browser.newContext({ viewport })
      await shotContext.addInitScript((value) => localStorage.setItem('starlight-theme', value), scheme)
      for (const slug of targets) await shootPage(shotContext, slug, label, scheme)
      await shotContext.close()
    }
  }
}
