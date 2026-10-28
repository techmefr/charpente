import { createRoot } from 'react-dom/client'
import 'virtual:charpente.css'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
const path = location.pathname
const loading = new URLSearchParams(location.search).get('state') === 'loading'

if (path === '/simple' || path === '/complex') {
  const { Fixture } = await import('./Fixture')
  root.render(<Fixture page={path === '/simple' ? 'simple' : 'complex'} loading={loading} />)
} else {
  const { App } = await import('./App')
  await import('./style.css')
  root.render(<App />)
}
