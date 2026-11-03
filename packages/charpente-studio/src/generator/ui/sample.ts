const svg = (body: string, width: number, height: number): string =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${body}</svg>`)}`

const avatar = (letter: string): string =>
  svg(`<rect width="64" height="64" fill="#0ea5e9"/><text x="32" y="42" font-size="30" text-anchor="middle" fill="#fff" font-family="sans-serif">${letter}</text>`, 64, 64)

const photo = svg('<rect width="320" height="120" fill="#6366f1"/><circle cx="240" cy="40" r="26" fill="#fde047"/><path d="M0 120 L90 50 L170 100 L230 70 L320 120Z" fill="#312e81"/>', 320, 120)

const row = (letter: string): string => `
  <li class="gen-row">
    <img class="gen-row-avatar" width="36" height="36" alt="" src="${avatar(letter)}">
    <div class="gen-row-text"><span>Release notes for the spring update</span><span class="gen-muted">Posted two days ago</span></div>
  </li>`

export const SAMPLE_HTML = `
<article class="gen-card">
  <header class="gen-card-head">
    <img class="gen-card-avatar" width="56" height="56" alt="" src="${avatar('C')}">
    <div class="gen-card-who"><h3>Camille Durand</h3><span class="gen-muted">Project lead, Lyon</span></div>
  </header>
  <p>A short introduction that spans two or three lines, to show how every line of text gets painted by the theme.</p>
  <img class="gen-card-photo" width="320" height="120" alt="" src="${photo}">
  <div class="gen-actions">
    <button type="button" class="gen-btn">Follow</button>
    <button type="button" class="gen-btn">Message</button>
  </div>
  <div class="gen-chart" data-charpente-block>
    <svg viewBox="0 0 120 30" width="120" height="30" aria-hidden="true"><polyline points="0,25 20,18 40,22 60,8 80,14 100,4 120,10" fill="none" stroke="currentColor" stroke-width="2"/></svg>
  </div>
</article>
<ul class="gen-list">${row('A')}${row('B')}${row('M')}</ul>
`
