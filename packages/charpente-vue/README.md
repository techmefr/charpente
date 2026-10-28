# charpente-vue

Vue wrapper for [charpente](https://github.com/techmefr/charpente): pure CSS skeleton loaders configured in one file, with no runtime JS.

## Install

```bash
pnpm add charpente charpente-vue
```

Set up the charpente config and CSS as described in the [main README](https://github.com/techmefr/charpente#readme), then wrap the loading area:

```
<Charpente :loading="pending" motion="none">...</Charpente>
```

Props: `loading`, `theme`, `motion`, `delay`, `stagger`, `label`.

## License

MIT
