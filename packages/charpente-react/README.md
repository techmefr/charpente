# charpente-react

React wrapper for [charpente](https://github.com/techmefr/charpente): pure CSS skeleton loaders configured in one file, with no runtime JS.

## Install

```bash
pnpm add charpente charpente-react
```

Set up the charpente config and CSS as described in the [main README](https://github.com/techmefr/charpente#readme), then wrap the loading area:

```
<Charpente as="ul" loading={pending}>...</Charpente>
```

Props: `loading`, `theme`, `motion`, `delay`, `stagger`, `label`.

## License

MIT
