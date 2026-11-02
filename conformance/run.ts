import { chromium } from 'playwright'
import targets from './targets.json' with { type: 'json' }
import { checkTargetPage } from './checks/check-target-page.ts'
import { PAGES, type Target } from './checks/settings.ts'

const only = process.argv[2]

const run = async (): Promise<void> => {
  const browser = await chromium.launch()
  let failures = 0

  for (const target of (targets as Target[]).filter((entry) => !only || entry.name === only)) {
    for (const pageName of PAGES) {
      const unique = await checkTargetPage(browser, target, pageName)
      failures += unique.length > 0 ? 1 : 0
      console.log(`${unique.length === 0 ? 'PASS' : 'FAIL'}  ${target.name.padEnd(8)} ${pageName}`)
      for (const problem of unique.slice(0, 12)) console.log(`        ${problem}`)
    }
  }

  await browser.close()
  process.exit(failures === 0 ? 0 : 1)
}

await run()
