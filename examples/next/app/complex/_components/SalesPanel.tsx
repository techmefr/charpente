export function SalesPanel() {
  return (
    <section className="panel">
      <h2>Ventes sur 12 mois</h2>
      <svg className="chart" width="600" height="140" viewBox="0 0 600 140" role="img" aria-label="Courbe des ventes">
        <polyline points="0,110 50,90 100,100 150,60 200,70 250,40 300,55 350,30 400,45 450,20 500,35 550,15 600,25" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
    </section>
  )
}
