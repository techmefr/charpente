import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const origin = process.env.DEMO_ORIGIN ?? 'http://127.0.0.1:4178'
const output = process.env.SHOTS_DIR ?? 'artifacts/glass-review'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(origin, { waitUntil: 'networkidle' })
  const theme = page.locator('.panel select').first()
  const banner = page.locator('.card__banner').first()
  for (const [name, blur] of [['glass', '12px'], ['frost', '24px'], ['smoked', '16px']]) {
    await theme.selectOption(name)
    await page.waitForTimeout(100)
    const style = await banner.evaluate((el) => {
      const css = getComputedStyle(el)
      return { filter: css.backdropFilter, image: css.backgroundImage, opacity: css.opacity }
    })
    assert.equal(style.filter, `blur(${blur}) saturate(1.15)`)
    assert.equal(style.opacity, '1', 'Transparency must not fade the whole element')
    assert.notEqual(style.image, 'none')
    await page.screenshot({ path: `${output}/${name}-light.png`, fullPage: true })
    await page.getByLabel('Sombre', { exact: true }).check()
    await page.screenshot({ path: `${output}/${name}-dark.png`, fullPage: true })
    await page.getByLabel('Sombre', { exact: true }).uncheck()
  }
  await theme.selectOption('glass')
  await page.getByLabel(/^Flou /).fill('30')
  await page.getByLabel(/^Opacité /).fill('0.35')
  await page.getByLabel(/^Reflet /).fill('0.4')
  await page.getByLabel('Teinte', { exact: true }).fill('#aabbcc')
  const custom = await banner.evaluate((el) => {
    const css = getComputedStyle(el)
    return { filter: css.backdropFilter, image: css.backgroundImage }
  })
  assert.equal(custom.filter, 'blur(30px) saturate(1.15)')
  assert.match(custom.image, /170, 187, 204|170 187 204|srgb 0\.666667 0\.733333 0\.8 \/ 0\.35/)
  const withBlur = await banner.screenshot()
  await page.addStyleTag({ content: '.grid--glass * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }' })
  const withoutBlur = await banner.screenshot()
  assert.notDeepEqual(withBlur, withoutBlur, 'Backdrop blur must visibly affect the patterned background')
  assert.notEqual(await banner.evaluate((el) => getComputedStyle(el).backgroundImage), 'none')
  await page.getByLabel('Chargement', { exact: true }).uncheck()
  assert.equal(await page.locator('.grid--glass').count(), 0)
  assert.equal(await page.locator('[data-charpente-loading]').count(), 0)
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  assert.deepEqual(errors, [])
  console.log('Glass, frost, smoked: light/dark, live controls, visible blur, fallback and mobile passed')
} finally {
  await browser.close()
}
