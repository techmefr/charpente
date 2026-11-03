import { expect } from './reporting.mjs'
import { urlOf } from './site-urls.mjs'

export const checkGallery = async (context) => {
  const gallery = await context.newPage()
  await gallery.goto(urlOf('themes'), { waitUntil: 'networkidle' })
  const roots = gallery.locator('#gallery .sample')
  expect((await roots.count()) === 25, 'themes: 25 themes rendered')
  const images = new Set()
  for (let index = 0; index < 25; index++) {
    images.add(await roots.nth(index).locator('.sample__name').evaluate((e) => getComputedStyle(e).backgroundImage))
  }
  expect(images.size === 25, `themes: 25 distinct text paints (${images.size})`)
  await gallery.selectOption('#gallery-motion', 'glitch')
  expect((await roots.first().locator('.sample__name').evaluate((e) => getComputedStyle(e).animationName)).includes('charpente-glitch'), 'themes: global motion selector')
  await gallery.close()
}
