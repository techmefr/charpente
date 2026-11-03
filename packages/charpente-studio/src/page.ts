import { MOTIONS, PATTERNS } from './theme-file'

const options = (names: readonly string[]): string => names.map((name) => `<option value="${name}">${name}</option>`).join('')

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const STYLE = `
body { margin: 0; font: 16px/1.5 system-ui, sans-serif; background: #f4f4f5; color: #18181b; display: grid; grid-template-columns: 320px 1fr; min-height: 100vh }
aside { padding: 24px; background: #fff; border-right: 1px solid #e4e4e7; display: grid; gap: 16px; align-content: start }
label { display: grid; gap: 4px; font-weight: 600; font-size: 14px }
input, select, button { font: inherit; padding: 6px 8px }
input[type=color] { padding: 0; height: 36px }
button { cursor: pointer; background: #18181b; color: #fff; border: 0; border-radius: 6px; padding: 10px }
main { padding: 32px; display: grid; place-items: center }
#stage { width: min(440px, 100%); padding: 24px; border-radius: 12px; background: #fff }
#stage.dark { background: #18181b; color: #fafafa }
article { display: grid; gap: 12px }
img { width: 64px; height: 64px; border-radius: 50% }
#status { min-height: 1.5em; font-size: 14px }
ul { margin: 0; padding-left: 18px; font-size: 14px }
`

export const studioPage = (): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Charpente studio</title>
<style>${STYLE}</style>
<style id="skeleton"></style>
</head>
<body>
<aside>
  <h1>Charpente studio</h1>
  <label>Name<input id="name" value="my-theme" autocomplete="off"></label>
  <label>Base color<input id="base" type="color" value="#e5e7eb"></label>
  <label>Strong color<input id="strong" type="color" value="#d1d5db"></label>
  <label>Pattern<select id="pattern">${options(PATTERNS)}</select></label>
  <label>Radius (px)<input id="radius" type="number" min="0" max="999" value="8"></label>
  <label>Scale of images and blocks<input id="scale" type="number" min="0.5" max="3" step="0.05" value="1.15"></label>
  <label>Motion (preview only)<select id="motion">${options(MOTIONS)}</select></label>
  <label><span><input id="dark" type="checkbox"> Dark preview</span></label>
  <button id="save" type="button">Save the theme</button>
  <p id="status" role="status"></p>
  <div><strong>Existing themes</strong><ul id="themes"></ul></div>
</aside>
<main>
  <div id="stage">
    <div id="preview" data-charpente-loading data-charpente-theme="studio">
      <article>
        <img alt="" src="${PIXEL}">
        <h2>Card title</h2>
        <p>A longer line of body text that shows how paragraphs are painted.</p>
        <button type="button">Action</button>
        <section data-charpente-block style="height: 64px"></section>
      </article>
    </div>
  </div>
</main>
<script src="/client.js"></script>
</body>
</html>
`
