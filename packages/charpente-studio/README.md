# charpente-studio

Optional visual editor for [charpente](https://github.com/techmefr/charpente) themes. It is not needed to use Charpente.

```bash
pnpm add -D charpente-studio
npx charpente-studio --dir themes --port 4400
```

Open the address it prints. Pick two colors, a pattern, a radius and the scale of images and blocks, and watch a skeleton card react live, with any motion and a dark preview. **Save the theme** writes `themes/<name>/theme.ts` in the short format, which Charpente discovers by itself.

The server only listens on 127.0.0.1 and only writes inside the theme folder, with a name made of lowercase letters, digits and dashes.

## License

MIT
