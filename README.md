# charpente

Pure CSS skeleton loaders: theme, motion and timing are three independent axes, configured in a single `charpente.config.ts`. No runtime JS.

## Packages

- `packages/charpente`: config-to-CSS compiler and Vite plugin (`charpente/vite`)
- `packages/charpente-vue`: `<Charpente :loading>` wrapper
- `demo`: demo page with live switching of theme, motion, timing and dark mode
- `site`: Astro documentation and demo site

## Usage

```ts
// charpente.config.ts
import { defineCharpente } from 'charpente'

export default defineCharpente({
  defaultTheme: 'cyberpunk',
  motion: ['shimmer', 'glitch'],
  timing: { delay: 120, stagger: 40 },
  colorScheme: { dark: '[data-theme="dark"]' },
  timeZone: 'Europe/Paris',
  schedule: [
    { theme: 'web', from: '10-15', to: '11-02' },
    { theme: 'dots', from: '12-01', to: '12-31' },
  ],
})
```

The first matching entry wins, otherwise `defaultTheme` applies. Dates are read in `timeZone`.

```ts
import { activeTheme } from 'virtual:charpente.theme'

const theme = activeTheme()
```

From the command line: `charpente theme --date 2026-10-31`.

```ts
// vite.config.ts
import { charpente } from 'charpente/vite'

export default { plugins: [charpente()] }
```

```ts
import 'virtual:charpente.css'
```

```vue
<Charpente :loading="pending" motion="none">
  <UserCard :user="user ?? placeholder" />
</Charpente>
```

Themes: `solid`, `outline`, `dots`, `cyberpunk`, `web`, `paper`, `glass`, `blueprint`, `halftone`, `stripes`, `scanline`, `neon`, `aurora`, `brutalist`, `sketch`, `topo`, `waves`, `valentine`, `birthday`, `pride`, `editorial`, `commerce`, `analytics`, `gaming`, `music`, `developer`, `travel`, `wellness`, `halloween`, `christmas`, `new-year`, `winter`, `summer`, `spring`, `autumn`. Motions: `shimmer`, `pulse`, `wave`, `glitch`.

`schedule: schedulePresets.all` (imported from `charpente`) applies celebrations first, then seasons; `celebrations` and `seasons` are also available separately.

`include: ['dots', 'christmas']` ships only those themes, plus the default theme, the scheduled ones and your own.

A theme can define `dark: { ... }` for its dark-mode tokens, and `colorScheme.light` (for example `'[data-theme="light"]'`) forces light inside a subtree.

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm demo
```
