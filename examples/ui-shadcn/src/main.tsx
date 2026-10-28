import { createRoot } from 'react-dom/client'
import 'virtual:charpente.css'
import './index.css'
import { ComplexPage } from './pages/ComplexPage'
import { SimplePage } from './pages/SimplePage'

const loading = new URLSearchParams(location.search).get('state') === 'loading'
const rootProps = loading ? { 'data-charpente-loading': '', 'aria-busy': true, inert: true } : {}
const Page = location.pathname === '/complex' ? ComplexPage : SimplePage

createRoot(document.getElementById('app') as HTMLElement).render(<Page rootProps={rootProps} />)
