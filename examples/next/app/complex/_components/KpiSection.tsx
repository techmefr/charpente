export function KpiSection() {
  return (
    <section className="kpis" aria-label="Indicateurs">
      <article className="kpi">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="currentColor" /></svg>
        <p className="kpi__label">Chiffre d'affaires</p>
        <strong className="kpi__value">48 210 €</strong>
        <span className="kpi__delta">+12 %</span>
      </article>
      <article className="kpi">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="2" width="16" height="16" fill="currentColor" /></svg>
        <p className="kpi__label">Commandes</p>
        <strong className="kpi__value">1 204</strong>
        <span className="kpi__delta">+4 %</span>
      </article>
      <article className="kpi">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><polygon points="10,2 18,18 2,18" fill="currentColor" /></svg>
        <p className="kpi__label">Panier moyen</p>
        <strong className="kpi__value">40,05 €</strong>
        <span className="kpi__delta">-1 %</span>
      </article>
      <article className="kpi">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="3" /></svg>
        <p className="kpi__label">Retours</p>
        <strong className="kpi__value">2,3 %</strong>
        <span className="kpi__delta">stable</span>
      </article>
    </section>
  )
}
