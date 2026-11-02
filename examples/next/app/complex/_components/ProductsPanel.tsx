export function ProductsPanel() {
  return (
    <section className="panel">
      <div className="tabs" role="tablist">
        <button type="button" role="tab" aria-selected="true">Populaires</button>
        <button type="button" role="tab" aria-selected="false">Nouveautés</button>
        <button type="button" role="tab" aria-selected="false">Promotions</button>
      </div>
      <div className="cards">
        <article className="card">
          <img className="card__img" width="320" height="120" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
          <h3>Carnet à spirale</h3>
          <p>Papier recyclé, 120 pages.</p>
          <button type="button">Ajouter</button>
        </article>
        <article className="card">
          <img className="card__img" width="320" height="120" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
          <h3>Stylo plume bleu</h3>
          <p>Plume fine, encre incluse.</p>
          <button type="button">Ajouter</button>
        </article>
        <article className="card">
          <img className="card__img" width="320" height="120" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
          <h3>Lampe de bureau</h3>
          <p>Bras articulé, LED chaude.</p>
          <button type="button">Ajouter</button>
        </article>
      </div>
    </section>
  )
}
