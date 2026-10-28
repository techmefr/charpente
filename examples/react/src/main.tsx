import { createRoot } from 'react-dom/client'
import 'virtual:charpente.css'
import { App } from './App'
import './style.css'

createRoot(document.getElementById('root') as HTMLElement).render(<App />)
