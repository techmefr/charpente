export function PageHeader() {
  return (
    <header className="dash__top">
      <h1>Tableau de bord</h1>
      <input type="search" placeholder="Rechercher" aria-label="Rechercher" />
      <button type="button">Exporter</button>
    </header>
  )
}
