# charpente-studio

Optional visual editor for [charpente](https://github.com/techmefr/charpente) themes. It is not needed to use Charpente.

```bash
pnpm add -D charpente-studio
npx charpente-studio --dir themes --port 4400
```

Open the address it prints. Pick two colors, a pattern, a radius and the scale of images and blocks, and watch a skeleton card react live, with any motion and a dark preview. **Save the theme** writes `themes/<name>/theme.ts` in the short format, which Charpente discovers by itself.

The server only listens on 127.0.0.1 and only writes inside the theme folder, which must stay under the current directory, with a name made of lowercase letters, digits and dashes. It answers 403 to any other Host or Origin (DNS rebinding, cross-site requests), 415 to a POST that is not application/json and 413 to a body over 10 kB. Saving over an existing theme returns 409 and the page asks for confirmation before overwriting. The page is served with a strict content security policy (same-origin scripts, inline styles, data: images, no framing).

## License

MIT
