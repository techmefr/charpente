import { render } from 'solid-js/web'
import 'virtual:charpente.css'
import { Fixture } from './Fixture'

const container = document.getElementById('root') as HTMLElement
const path = location.pathname
const loading = new URLSearchParams(location.search).get('state') === 'loading'

if (path === '/simple' || path === '/complex') {
  render(() => <Fixture page={path === '/simple' ? 'simple' : 'complex'} loading={loading} />, container)
}
