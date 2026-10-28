import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

mkdirSync('src/generated', { recursive: true })
execFileSync('pnpm', ['exec', 'charpente', 'build', '--out', 'src/generated/charpente.css'], { stdio: 'inherit' })
copyFileSync('../../fixtures/page.css', 'src/generated/page.css')
for (const page of ['simple', 'complex']) {
  const html = readFileSync(`../../fixtures/${page}.html`, 'utf8')
  const bound = html.replace('data-testid="root"', 'data-testid="root" [charpente]="loading"')
  writeFileSync(`src/generated/${page}.html`, bound)
}
