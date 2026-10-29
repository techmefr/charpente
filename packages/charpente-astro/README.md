<p>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/techmefr/charpente/main/site/public/brand/logo-dark.svg">
    <img src="https://raw.githubusercontent.com/techmefr/charpente/main/site/public/brand/logo-light.svg" alt="charpente" width="64" height="64">
  </picture>
</p>

# charpente-astro

Astro wrapper for [charpente](https://github.com/techmefr/charpente): pure CSS skeleton loaders configured in one file, with no runtime JS.

## Install

```bash
pnpm add charpente charpente-astro
```

Set up the charpente config and CSS as described in the [main README](https://github.com/techmefr/charpente#readme), then wrap the loading area:

```
<Charpente as="main" loading={pending}>...</Charpente>
```

Props: `loading`, `theme`, `motion`, `delay`, `stagger`, `label`.

## License

MIT
