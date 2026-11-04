const STYLE = `
:root { color-scheme: light dark; --gen-bg: Canvas; --gen-field: Canvas; --gen-fg: CanvasText; --gen-line: color-mix(in srgb, CanvasText 22%, transparent); --gen-muted: color-mix(in srgb, CanvasText 62%, transparent); --gen-accent: AccentColor; --gen-accent-fg: AccentColorText; --gen-accent-text: LinkText }
body { margin: 0; font: 16px/1.5 system-ui, sans-serif; background: color-mix(in srgb, CanvasText 5%, Canvas); color: CanvasText }
header { padding: 1.25rem 1.5rem 0 }
h1 { margin: 0; font-size: 1.4rem }
header p { margin: 0.25rem 0 0; color: var(--gen-muted) }
#generator { padding: 1rem 1.5rem 2rem; max-width: 96rem; margin: 0 auto }
`

export const studioPage = (): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Charpente studio</title>
<style>${STYLE}</style>
</head>
<body>
<header>
  <h1>Charpente studio</h1>
  <p>Build a theme by choosing shapes, borders, paint, motion and hover, then save themes/&lt;name&gt;/theme.ts.</p>
</header>
<main id="generator" aria-label="Theme generator"><noscript>This page needs JavaScript.</noscript></main>
<script src="/client.js"></script>
</body>
</html>
`
