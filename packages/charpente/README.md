<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/techmefr/charpente/main/site/public/brand/readme-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/techmefr/charpente/main/site/public/brand/readme-light.svg">
    <img src="https://raw.githubusercontent.com/techmefr/charpente/main/site/public/brand/readme-light.svg" alt="charpente — the structure before the content" width="800">
  </picture>
</p>

<p align="center">
  Pure CSS skeleton loaders, shaped by your existing page layout.<br>
  Choose the look, the motion and the timing in one configuration file.
</p>

<p align="center">
  <a href="https://techmefr.github.io/charpente/">Documentation</a> ·
  <a href="https://techmefr.github.io/charpente/playground/">Playground</a> ·
  <a href="https://techmefr.github.io/charpente/themes/">38 themes</a> ·
  <a href="https://github.com/techmefr/charpente/blob/main/LICENSE">MIT license</a>
</p>

---

## Keep the layout. Load the content.

Charpente paints your text, images, buttons and blocks as skeleton placeholders while an area is loading. When the data arrives, switch off the loading state to reveal the content in the same layout.

The Vite plugin generates the CSS at build time. Skeleton painting and animation need no runtime JavaScript; framework wrappers connect the loading state to your application.

| Appearance | Movement | Timing |
| --- | --- | --- |
| 38 built-in themes, custom tokens, light and dark modes | Shimmer, pulse, wave and glitch, alone or combined | Delay to avoid flashes on fast loads; stagger between elements |

## Get started

```sh
pnpm add charpente
```

Register the Vite plugin and import its generated stylesheet from your application entry point.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { charpente } from 'charpente/vite'

export default defineConfig({
  plugins: [charpente()],
})
```

```ts
// Application entry point
import 'virtual:charpente.css'
```

Tune the defaults in `charpente.config.ts`:

```ts
import { defineCharpente } from 'charpente'

export default defineCharpente({
  defaultTheme: 'solid',
  motion: 'shimmer',
  timing: { delay: 120, stagger: 40 },
  colorScheme: { dark: '[data-theme="dark"]' },
})
```

Use your framework wrapper, or mark the loading area in plain HTML:

```html
<section data-charpente-loading aria-busy="true" inert>
  <h2>Team</h2>
  <p>A short introduction to the team.</p>
  <img src="/team.jpg" alt="The team" width="320" height="180" />
  <button type="button">Meet the team</button>
</section>
```

When content is ready, remove `data-charpente-loading`, `aria-busy` and `inert`. Wrappers handle these attributes for you. Use representative placeholder content and explicit image dimensions to reserve the space your final content needs.

[Follow the installation guide](https://techmefr.github.io/charpente/getting-started/) for framework-specific setup.

## Use it with your stack

Wrappers accept `loading`, `theme`, `motion`, `delay`, `stagger` and `label`.

| Framework | Package | Usage |
| --- | --- | --- |
| Vue, Nuxt | `charpente-vue` | `<Charpente :loading="pending" motion="none">` |
| React, Next | `charpente-react` | `<Charpente as="ul" loading={pending}>` |
| Svelte | `charpente-svelte` | `<Charpente tag="main" loading={pending}>` |
| Solid | `charpente-solid` | `<Charpente tag="main" loading={pending()}>` |
| Angular | `charpente-angular` | `<main [charpente]="pending">` |
| Astro | `charpente-astro` | `<Charpente as="main" loading={pending}>` |
| Laravel, Livewire | `packages/charpente-blade` | `<x-charpente :loading="$pending" tag="main">` |
| Vanilla | `charpente/dom` | `setLoading(element, { loading: true })` |

## Make it yours

Themes: `solid`, `outline`, `dots`, `cyberpunk`, `web`, `paper`, `glass`, `frost`, `smoked`, `blueprint`, `halftone`, `stripes`, `scanline`, `neon`, `vegas`, `aurora`, `brutalist`, `sketch`, `topo`, `waves`, `valentine`, `birthday`, `pride`, `editorial`, `commerce`, `analytics`, `gaming`, `music`, `developer`, `travel`, `wellness`, `halloween`, `christmas`, `new-year`, `winter`, `summer`, `spring`, `autumn`. Motions: `shimmer`, `pulse`, `wave`, `glitch`.

`schedule: schedulePresets.all` (imported from `charpente`) applies celebrations first, then seasons; `celebrations` and `seasons` are also available separately.

`include: ['dots', 'christmas']` ships only those themes, plus the default theme, the scheduled ones and your own.

A theme can define `dark: { ... }` for its dark-mode tokens, and `colorScheme.light` (for example `'[data-theme="light"]'`) forces light inside a subtree.

## Glass themes

`glass` is lightly tinted and translucent, `frost` uses stronger blur and a milkier finish,
and `smoked` uses a dark tint. Place shapes or an image behind the loading area to see the
backdrop blur. On a flat background, only the tint, edges and reflection are visible.
The translucent fill remains when backdrop filters are unsupported; no JavaScript is needed.

```ts
import { createGlassTheme, defineCharpente } from 'charpente'

export default defineCharpente({
  defaultTheme: 'my-glass',
  themes: {
    'my-glass': createGlassTheme({
      blur: '18px',
      opacity: 0.15,
      tint: '#b8c4ff',
      reflection: 0.2,
    }),
  },
})
```

Opacity and reflection range from 0 to 1. Local CSS overrides use
`--charpente-glass-blur`, `--charpente-glass-opacity`, `--charpente-glass-tint`
and `--charpente-glass-reflection`. These control paint only, leaving the element
and its children fully opaque. The demo includes live controls and a patterned backdrop.

## Accessibility

Framework wrappers announce loading and keep placeholder controls out of keyboard navigation. In plain HTML, set `aria-busy` and `inert` on the loading area. Your content still needs meaningful labels, suitable contrast and appropriate placeholder dimensions.

[Read the accessibility guide](https://techmefr.github.io/charpente/accessibility/).

## Work on Charpente

```sh
pnpm install
pnpm build
pnpm test
pnpm demo
```

| Directory | Purpose |
| --- | --- |
| `packages/charpente` | CSS compiler, CLI, DOM helpers and Vite plugin |
| `packages/charpente-*` | Framework integrations |
| `site` | Documentation and interactive playground |
| `demo` | Standalone Vue demo |
| `examples` | Working framework integrations |

## License

[MIT](https://github.com/techmefr/charpente/blob/main/LICENSE)
