import { loadingAttributes, type SearchParams } from "../_lib/state"

export default async function ComplexPage({ searchParams }: { searchParams: SearchParams }) {
  const attributes = await loadingAttributes(searchParams)
  return (
    <div data-testid="root" className="dash" {...attributes}>
        <aside className="dash__side">
          <p className="dash__brand">Atelier</p>
          <nav aria-label="Principal">
            <a href="#">Tableau de bord</a>
            <a href="#">Commandes</a>
            <a href="#">Clients</a>
            <a href="#">Catalogue</a>
            <a href="#">Réglages</a>
          </nav>
        </aside>
        <div className="dash__main">
          <header className="dash__top">
            <h1>Tableau de bord</h1>
            <input type="search" placeholder="Rechercher" aria-label="Rechercher" />
            <button type="button">Exporter</button>
          </header>
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
          <section className="panel">
            <h2>Ventes sur 12 mois</h2>
            <svg className="chart" width="600" height="140" viewBox="0 0 600 140" role="img" aria-label="Courbe des ventes">
              <polyline points="0,110 50,90 100,100 150,60 200,70 250,40 300,55 350,30 400,45 450,20 500,35 550,15 600,25" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </section>
          <section className="panel">
            <h2>Commandes récentes</h2>
            <table className="orders">
              <thead>
                <tr><th>N°</th><th>Client</th><th>Date</th><th>Total</th><th>Statut</th></tr>
              </thead>
              <tbody>
                <tr><td>1001</td><td>Atelier Lumière</td><td>12/10/2026</td><td>1 240,00 €</td><td><span className="badge">Payée</span></td></tr>
                <tr><td>1002</td><td>Maison Verdier</td><td>12/10/2026</td><td>389,90 €</td><td><span className="badge">En cours</span></td></tr>
                <tr><td>1003</td><td>Studio Pivoine</td><td>11/10/2026</td><td>2 075,50 €</td><td><span className="badge">Payée</span></td></tr>
                <tr><td>1004</td><td>Café du Port</td><td>11/10/2026</td><td>96,00 €</td><td><span className="badge">Remboursée</span></td></tr>
                <tr><td>1005</td><td>Librairie Nord</td><td>10/10/2026</td><td>512,30 €</td><td><span className="badge">Payée</span></td></tr>
                <tr><td>1006</td><td>Fleuriste Rose</td><td>10/10/2026</td><td>148,00 €</td><td><span className="badge">En cours</span></td></tr>
                <tr><td>1007</td><td>Garage Moreau</td><td>09/10/2026</td><td>3 410,00 €</td><td><span className="badge">Payée</span></td></tr>
                <tr><td>1008</td><td>Boulangerie Alba</td><td>09/10/2026</td><td>74,20 €</td><td><span className="badge">Payée</span></td></tr>
              </tbody>
            </table>
          </section>
          <section className="panel panel--split">
            <form className="filters" aria-label="Filtres">
              <h2>Filtres</h2>
              <label>Client <input type="text" name="customer" placeholder="Nom du client" /></label>
              <label>Statut
                <select name="status">
                  <option>Tous</option>
                  <option>Payée</option>
                  <option>En cours</option>
                </select>
              </label>
              <label>Note <textarea name="note" rows={3} placeholder="Remarque"></textarea></label>
              <label className="check"><input type="checkbox" name="late" /> Retards seulement</label>
              <button type="submit">Appliquer</button>
            </form>
            <div className="feed">
              <h2>Activité</h2>
              <ul>
                <li>
                  <img className="feed__avatar" width="32" height="32" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                  <p><strong>Camille</strong> a validé la commande <a href="#">#1042</a> hier à 16 h.</p>
                </li>
                <li>
                  <img className="feed__avatar" width="32" height="32" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                  <p><strong>Mehdi</strong> a ajouté une note sur <a href="#">Atelier Lumière</a>.</p>
                </li>
                <li>
                  <img className="feed__avatar" width="32" height="32" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                  <p><strong>Inès</strong> a publié la fiche <a href="#">Lampe de bureau</a>.</p>
                </li>
              </ul>
            </div>
          </section>
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
        </div>
      </div>
  )
}
