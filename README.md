<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="site/public/brand/readme-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="site/public/brand/readme-light.svg">
    <img src="site/public/brand/readme-light.svg" alt="charpente — the structure before the content" width="800">
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

<p align="center">
  <a href="https://www.npmjs.com/package/charpente"><img src="https://img.shields.io/npm/v/charpente?color=informational" alt="npm version"></a>
  <img src="https://img.shields.io/badge/runtime%20JS-0%20kB-brightgreen" alt="zero runtime JS">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license">
</p>

<p align="center">
  <img src="site/public/readme/demo.gif" alt="A list showing skeleton placeholders, then the loaded content in the same layout" width="560">
</p>

<p align="center">
  <img src="site/public/readme/themes.png" alt="The same loading layout with six themes: solid, cyberpunk, christmas, blueprint, neon and aurora" width="800">
</p>

<p align="center"><sub>One layout, six of the 38 themes: solid, cyberpunk, christmas, blueprint, neon, aurora.</sub></p>

---

## Why Charpente

- **Shaped by your layout**: skeletons follow your real text, images and buttons, so nothing jumps when data arrives.
- **Pure CSS**: generated at build time, no runtime JavaScript to paint or animate.
- **One config file**: themes, motion and timing, with dark mode and seasonal theming.
- **Accessible by default**: wrappers handle `aria-busy` and `inert` for you.

## Quick start

```sh
pnpm add charpente    # or npm install / yarn add / bun add
```

```ts
// vite.config.ts
import { defineConfig } from vite
import { charpente } from charpente/vite

export default defineConfig({ plugins: [charpente()] })
```

```ts
// entry point
import virtual:charpente.css
```

```html
<section data-charpente-loading aria-busy="true" inert>
  <h2>Team</h2>
  <p>A short introduction to the team.</p>
</section>
```

Remove the attributes when your content is ready.

## Your framework

| Framework | Package |
| --- | --- |
| Vue, Nuxt | `charpente-vue` |
| React, Next | `charpente-react` |
| Svelte | `charpente-svelte` |
| Solid | `charpente-solid` |
| Angular | `charpente-angular` |
| Astro | `charpente-astro` |
| Laravel, Livewire | `charpente-blade` |
| Vanilla | `charpente/dom` |

## Go further

[Installation guide](https://techmefr.github.io/charpente/getting-started/) ·
[Themes](https://techmefr.github.io/charpente/themes/) ·
[Playground](https://techmefr.github.io/charpente/playground/) ·
[Accessibility](https://techmefr.github.io/charpente/accessibility/)

## Contributing

This repository is a pnpm workspace.

```sh
pnpm install && pnpm build && pnpm test
```

## License

[MIT](LICENSE)
