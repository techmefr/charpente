import { Charpente } from 'charpente-react'
import { useEffect, useState } from 'react'

interface Product {
  id: number
  name: string
  price: string
  stock: string
}

const GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const products: Product[] = [
  { id: 1, name: 'Carnet à spirale', price: '6,90 €', stock: 'En stock' },
  { id: 2, name: 'Stylo plume bleu', price: '24,00 €', stock: 'Plus que 3' },
  { id: 3, name: 'Lampe de bureau', price: '39,50 €', stock: 'En stock' },
  { id: 4, name: 'Cadre en bois', price: '15,00 €', stock: 'Sur commande' },
  { id: 5, name: 'Mug en grès', price: '12,00 €', stock: 'En stock' },
  { id: 6, name: 'Plaid en laine', price: '58,00 €', stock: 'Plus que 1' },
]

const placeholder: Product = { id: 0, name: 'Nom du produit', price: '00,00 €', stock: 'En stock' }

const THEMES = ['outline', 'solid', 'dots', 'web', 'cyberpunk', 'brand']

export function App() {
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('outline')

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(timer)
  }, [loading])

  const items = loading ? products.map(() => placeholder) : products

  return (
    <main className="page">
      <header className="head">
        <h1>Catalogue</h1>
        <div className="head__actions">
          <select aria-label="Thème" value={theme} onChange={(event) => setTheme(event.target.value)}>
            {THEMES.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <button type="button" disabled={loading} onClick={() => setLoading(true)}>
            Recharger
          </button>
        </div>
      </header>

      <Charpente as="ul" className="grid" loading={loading} theme={theme}>
        {items.map((product, index) => (
          <li key={index} className="tile">
            <img className="tile__img" width={96} height={96} alt="" src={GIF} />
            <h2>{product.name}</h2>
            <p>{product.stock}</p>
            <strong>{product.price}</strong>
          </li>
        ))}
      </Charpente>
    </main>
  )
}
