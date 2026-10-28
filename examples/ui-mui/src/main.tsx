import { CssBaseline } from '@mui/material'
import { createRoot } from 'react-dom/client'
import 'virtual:charpente.css'
import { Complex } from './Complex'
import { Simple } from './Simple'

const loading = new URLSearchParams(window.location.search).get('state') === 'loading'
const complex = window.location.pathname.startsWith('/complex')

createRoot(document.getElementById('app') as HTMLElement).render(
  <>
    <CssBaseline />
    {complex ? <Complex loading={loading} /> : <Simple loading={loading} />}
  </>,
)
