import 'virtual:charpente.css'
import '../../../fixtures/page.css'
import simple from '../../../fixtures/simple.html?raw'
import complex from '../../../fixtures/complex.html?raw'

const pages = { simple, complex }
const page = location.pathname.includes('complex') ? 'complex' : 'simple'
const loading = new URLSearchParams(location.search).get('state') === 'loading'
const html = pages[page]

document.getElementById('app').innerHTML = loading
  ? html.replace('data-testid="root"', 'data-testid="root" data-charpente-loading aria-busy="true" inert')
  : html
