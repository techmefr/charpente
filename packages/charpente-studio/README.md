# charpente-studio

Optional visual editor for [charpente](https://github.com/techmefr/charpente) themes. It is not needed to use Charpente.

```bash
pnpm add -D charpente-studio
npx charpente-studio --dir themes --port 4400
```

Open the address it prints. Start from a built-in theme or an empty one, then choose shapes (radius and clip-path), borders, paint (patterns or a pasted CSS fill), motion with speed and delay, and hover per kind of leaf, with a live light and dark preview. Colors follow your site (`var(--charpente-base)`...) unless you fix values. **Save** writes `themes/<name>/theme.ts`; Copy, Download, import of an existing theme.ts and a shareable URL hash are also there. The same generator runs without a server on the documentation site.

The server only listens on 127.0.0.1 and only writes inside the theme folder, which must stay under the current directory, with a name made of lowercase letters, digits and dashes. It answers 403 to any other Host or Origin (DNS rebinding, cross-site requests), 415 to a POST that is not application/json and 413 to a body over 100 kB. Saving over an existing theme returns 409 and the page asks for confirmation before overwriting. The page is served with a strict content security policy (same-origin scripts, inline styles, data: images, no framing).

## License

MIT
