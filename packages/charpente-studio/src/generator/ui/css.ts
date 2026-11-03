export const GENERATOR_CSS = `
.gen { display: grid; gap: 1rem; color: var(--gen-fg); font: inherit; align-items: start }
.gen *, .gen *::before, .gen *::after { box-sizing: border-box }
.gen [hidden] { display: none !important }
@media (min-width: 62rem) { .gen { grid-template-columns: minmax(18rem, 22rem) minmax(0, 1fr) } .gen-output { position: sticky; top: 1rem } }
.gen-controls, .gen-output { display: grid; gap: 0.75rem; min-width: 0 }
.gen-panel { background: var(--gen-bg); border: 1px solid var(--gen-line); border-radius: 0.75rem; padding: 0.9rem; display: grid; gap: 0.75rem }
.gen-section { background: var(--gen-bg); border: 1px solid var(--gen-line); border-radius: 0.75rem }
.gen-section > summary { cursor: pointer; padding: 0.7rem 0.9rem; font-weight: 650 }
.gen-section-body { display: grid; gap: 0.7rem; padding: 0 0.9rem 0.9rem }
.gen-field { display: grid; gap: 0.25rem }
.gen-field > label { font-size: 0.85rem; font-weight: 600 }
.gen-field small, .gen-note { color: var(--gen-muted); font-size: 0.78rem; margin: 0 }
.gen input[type=text], .gen input[type=number], .gen select, .gen textarea { width: 100%; font: inherit; font-size: 0.9rem; padding: 0.4rem 0.55rem; color: var(--gen-fg); background: var(--gen-field); border: 1px solid var(--gen-line); border-radius: 0.4rem }
.gen textarea { resize: vertical; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.8rem }
.gen input[type=color] { width: 3rem; height: 2rem; padding: 0; border: 1px solid var(--gen-line); border-radius: 0.3rem; background: transparent }
.gen input[aria-invalid=true] { border-color: var(--gen-accent) }
.gen :focus-visible { outline: 2px solid var(--gen-accent); outline-offset: 2px }
.gen-chips { display: flex; flex-wrap: wrap; gap: 0.35rem }
.gen-chip { position: relative; display: inline-flex }
.gen-chip input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer }
.gen-chip span { padding: 0.25rem 0.65rem; border: 1px solid var(--gen-line); border-radius: 999px; font-size: 0.82rem; background: var(--gen-field) }
.gen-chip input:checked + span { background: var(--gen-accent); color: var(--gen-accent-fg); border-color: var(--gen-accent) }
.gen-chip:has(:focus-visible) { outline: 2px solid var(--gen-accent); outline-offset: 2px; border-radius: 999px }
.gen fieldset { border: 0; padding: 0; margin: 0; min-width: 0 }
.gen legend { font-size: 0.85rem; font-weight: 600; padding: 0; margin-bottom: 0.3rem }
.gen-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(4.4rem, 1fr)); gap: 0.4rem }
.gen-tile { display: grid; gap: 0.25rem; justify-items: center; padding: 0.4rem 0.2rem; font: inherit; font-size: 0.74rem; color: var(--gen-fg); background: var(--gen-field); border: 1px solid var(--gen-line); border-radius: 0.5rem; cursor: pointer }
.gen-tile[aria-pressed=true] { border-color: var(--gen-accent); box-shadow: 0 0 0 2px var(--gen-accent) }
.gen-swatch { width: 2.6rem; height: 1.7rem; background: var(--gen-accent) }
.gen-swatch-fill { background-color: transparent; border: 1px solid var(--gen-line); border-radius: 0.25rem }
.gen-inline { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; font-size: 0.8rem; color: var(--gen-muted) }
.gen-link { font: inherit; padding: 0; color: var(--gen-accent-text); background: none; border: 0; text-decoration: underline; cursor: pointer }
.gen-problem { color: var(--gen-accent-text); min-height: 0 }
.gen-check { display: flex; gap: 0.5rem; align-items: center }
.gen-colors { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem }
.gen-start { display: grid; gap: 0.7rem }
.gen-button { font: inherit; font-size: 0.88rem; padding: 0.45rem 0.9rem; color: var(--gen-fg); background: var(--gen-field); border: 1px solid var(--gen-line); border-radius: 0.5rem; cursor: pointer }
.gen-primary { color: var(--gen-accent-fg); background: var(--gen-accent); border-color: var(--gen-accent) }
.gen-actions-row { display: flex; flex-wrap: wrap; gap: 0.5rem }
.gen-status { min-height: 1.3em; margin: 0; font-size: 0.85rem; color: var(--gen-muted) }
.gen-toolbar { display: flex; flex-wrap: wrap; gap: 0.6rem 1rem; align-items: center; justify-content: space-between }
.gen-stage { color-scheme: light; background: Canvas; color: CanvasText; border: 1px solid var(--gen-line); border-radius: 0.75rem; padding: 1.1rem }
.gen-stage.gen-dark { color-scheme: dark }
.gen-stage-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); align-items: start }
.gen-stage h3 { margin: 0; font-size: 1rem }
.gen-stage p { margin: 0; font-size: 0.9rem; line-height: 1.5 }
.gen-muted { font-size: 0.82rem; color: color-mix(in srgb, CanvasText 62%, transparent) }
.gen-card { display: grid; gap: 0.6rem; padding: 1rem; border: 1px solid color-mix(in srgb, CanvasText 14%, transparent); border-radius: 0.8rem }
.gen-card-head { display: flex; gap: 0.7rem; align-items: center }
.gen-card-who { display: grid }
.gen-card-avatar { width: 3.5rem; height: 3.5rem; border-radius: 50% }
.gen-card-photo { width: 100%; height: 5rem; object-fit: cover; border-radius: 0.5rem }
.gen-actions { display: flex; gap: 0.5rem }
.gen-btn { font: inherit; font-size: 0.88rem; padding: 0.45rem 1rem; border-radius: 0.4rem; border: 1px solid color-mix(in srgb, CanvasText 25%, transparent); background: color-mix(in srgb, CanvasText 6%, Canvas); color: CanvasText }
.gen-chart { height: 2.8rem; padding: 0.4rem }
.gen-chart svg { width: 100%; height: 100% }
.gen-list { display: grid; gap: 0.6rem; margin: 0; padding: 0; list-style: none; align-content: start }
.gen-row { display: flex; gap: 0.6rem; align-items: center; padding: 0.55rem; border: 1px solid color-mix(in srgb, CanvasText 14%, transparent); border-radius: 0.6rem }
.gen-row-avatar { width: 2.25rem; height: 2.25rem; border-radius: 50% }
.gen-row-text { display: grid; font-size: 0.88rem }
@media (prefers-reduced-motion: reduce) { .gen * { transition: none !important } }
`
