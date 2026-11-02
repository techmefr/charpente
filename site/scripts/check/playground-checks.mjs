import { expect, fail } from './reporting.mjs'
import { urlOf } from './site-urls.mjs'

const motionInput = (name) => `#pg-motions input[value="${name}"]`

const readBase = (root) => root.evaluate((e) => getComputedStyle(e).getPropertyValue('--charpente-base').trim())

const readTheme = (page) => page.evaluate(() => document.documentElement.dataset.theme)

const checkThemeAndMotions = async (page, root, style) => {
  const solidImage = await style('backgroundImage')
  expect((await style('animationName')).includes('charpente-shimmer'), 'playground: shimmer active by default')

  await page.selectOption('#pg-theme', 'cyberpunk')
  const cyberImage = await style('backgroundImage')
  expect(cyberImage !== solidImage && cyberImage.includes('repeating-linear-gradient'), 'playground: theme changes the computed background')
  expect((await root.getAttribute('data-charpente-theme')) === 'cyberpunk', 'playground: data-charpente-theme attribute set')

  await page.uncheck(motionInput('shimmer'))
  await page.check(motionInput('glitch'))
  await page.check(motionInput('pulse'))
  const names = await style('animationName')
  expect(names.includes('charpente-pulse') && names.includes('charpente-glitch') && !names.includes('shimmer'), `playground: glitch + pulse motions applied (${names})`)
  expect((await root.getAttribute('data-charpente-motion')) === 'glitch pulse', 'playground: names sorted and separated by a space')

  await page.uncheck(motionInput('pulse'))
  await page.uncheck(motionInput('glitch'))
  expect((await root.getAttribute('data-charpente-motion')) === 'none', 'playground: no motion gives none')
  expect(!(await style('animationName')).includes('charpente-glitch'), 'playground: none removes the animations')

  await page.check(motionInput('glitch'))
  await page.check(motionInput('shimmer'))
  expect((await style('animationName')).includes('charpente-glitch'), 'playground: glitch + shimmer applied')
}

const checkTimings = async (page, root, style) => {
  await page.locator('#pg-stagger').fill('0')
  await page.locator('#pg-delay').fill('500')
  expect((await style('animationDelay')).includes('0.5s'), `playground: 500 ms delay applied (${await style('animationDelay')})`)
  await page.locator('#pg-stagger').fill('100')
  expect((await root.evaluate((e) => e.style.getPropertyValue('--charpente-stagger'))) === '100ms', 'playground: stagger set as inline style')
}

const checkLoadingToggle = async (page, root, style) => {
  await page.click('#pg-toggle')
  expect((await root.getAttribute('data-charpente-loading')) === null, 'playground: switching to loaded removes data-charpente-loading')
  expect((await root.getAttribute('aria-busy')) === null && (await root.getAttribute('inert')) === null, 'playground: aria-busy and inert removed')
  expect((await style('backgroundImage')) === 'none', 'playground: no paint once loaded')
  await page.click('#pg-toggle')
  expect((await root.getAttribute('data-charpente-loading')) !== null && (await root.getAttribute('inert')) !== null, 'playground: back to loading')
  expect((await style('backgroundImage')) !== 'none', 'playground: paint is back')
}

const checkDarkMode = async (page, root) => {
  await page.selectOption('#pg-theme', 'solid')
  const baseLight = await readBase(root)
  for (let attempt = 0; attempt < 3 && (await readTheme(page)) !== 'dark'; attempt++) {
    await page.click('starlight-rapide-theme-select button:visible')
  }
  expect((await readTheme(page)) === 'dark', 'playground: switches to dark')
  const baseDark = await readBase(root)
  expect(baseDark !== baseLight, `playground: dark tokens active (${baseLight} -> ${baseDark})`)
}

export const checkPlayground = async (context) => {
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(urlOf('playground'), { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)

  const leaf = page.locator('#pg-root .kpi__value').first()
  const root = page.locator('#pg-root')
  const style = (property) => leaf.evaluate((element, name) => getComputedStyle(element)[name], property)

  await checkThemeAndMotions(page, root, style)
  await checkTimings(page, root, style)
  await checkLoadingToggle(page, root, style)
  await checkDarkMode(page, root)
  for (const error of errors) fail(`playground: ${error}`)
  await page.close()
}
