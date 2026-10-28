<script lang="ts">
  let { data } = $props()

  const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  const links = ["Tableau de bord", "Commandes", "Clients", "Catalogue", "Réglages"]
  const kpis = [
    { label: "Chiffre d'affaires", value: "48 210 €", delta: "+12 %" },
    { label: "Commandes", value: "1 204", delta: "+4 %" },
    { label: "Panier moyen", value: "40,05 €", delta: "-1 %" },
    { label: "Retours", value: "2,3 %", delta: "stable" },
  ]
  const orders = [
    ["1001", "Atelier Lumière", "12/10/2026", "1 240,00 €", "Payée"],
    ["1002", "Maison Verdier", "12/10/2026", "389,90 €", "En cours"],
    ["1003", "Studio Pivoine", "11/10/2026", "2 075,50 €", "Payée"],
    ["1004", "Café du Port", "11/10/2026", "96,00 €", "Remboursée"],
    ["1005", "Librairie Nord", "10/10/2026", "512,30 €", "Payée"],
    ["1006", "Fleuriste Rose", "10/10/2026", "148,00 €", "En cours"],
    ["1007", "Garage Moreau", "09/10/2026", "3 410,00 €", "Payée"],
    ["1008", "Boulangerie Alba", "09/10/2026", "74,20 €", "Payée"],
  ]
  const products = [
    { title: "Carnet à spirale", text: "Papier recyclé, 120 pages." },
    { title: "Stylo plume bleu", text: "Plume fine, encre incluse." },
    { title: "Lampe de bureau", text: "Bras articulé, LED chaude." },
  ]
  const tabs = ["Populaires", "Nouveautés", "Promotions"]
</script>

<div
  data-testid="root"
  class="dash"
  data-charpente-loading={data.loading ? "" : undefined}
  aria-busy={data.loading ? "true" : undefined}
  inert={data.loading}
>
  <aside class="dash__side">
    <p class="dash__brand">Atelier</p>
    <nav aria-label="Principal">
      {#each links as link}
        <a href="#">{link}</a>
      {/each}
    </nav>
  </aside>
  <div class="dash__main">
    <header class="dash__top">
      <h1>Tableau de bord</h1>
      <input type="search" placeholder="Rechercher" aria-label="Rechercher" />
      <button type="button">Exporter</button>
    </header>

    <section class="kpis" aria-label="Indicateurs">
      <article class="kpi">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="currentColor" /></svg>
        <p class="kpi__label">{kpis[0].label}</p>
        <strong class="kpi__value">{kpis[0].value}</strong>
        <span class="kpi__delta">{kpis[0].delta}</span>
      </article>
      <article class="kpi">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="2" width="16" height="16" fill="currentColor" /></svg>
        <p class="kpi__label">{kpis[1].label}</p>
        <strong class="kpi__value">{kpis[1].value}</strong>
        <span class="kpi__delta">{kpis[1].delta}</span>
      </article>
      <article class="kpi">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><polygon points="10,2 18,18 2,18" fill="currentColor" /></svg>
        <p class="kpi__label">{kpis[2].label}</p>
        <strong class="kpi__value">{kpis[2].value}</strong>
        <span class="kpi__delta">{kpis[2].delta}</span>
      </article>
      <article class="kpi">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="3" /></svg>
        <p class="kpi__label">{kpis[3].label}</p>
        <strong class="kpi__value">{kpis[3].value}</strong>
        <span class="kpi__delta">{kpis[3].delta}</span>
      </article>
    </section>

    <section class="panel">
      <h2>Ventes sur 12 mois</h2>
      <svg class="chart" width="600" height="140" viewBox="0 0 600 140" role="img" aria-label="Courbe des ventes">
        <polyline points="0,110 50,90 100,100 150,60 200,70 250,40 300,55 350,30 400,45 450,20 500,35 550,15 600,25" fill="none" stroke="currentColor" stroke-width="3" />
      </svg>
    </section>

    <section class="panel">
      <h2>Commandes récentes</h2>
      <table class="orders">
        <thead>
          <tr><th>N°</th><th>Client</th><th>Date</th><th>Total</th><th>Statut</th></tr>
        </thead>
        <tbody>
          {#each orders as order}
            <tr><td>{order[0]}</td><td>{order[1]}</td><td>{order[2]}</td><td>{order[3]}</td><td><span class="badge">{order[4]}</span></td></tr>
          {/each}
        </tbody>
      </table>
    </section>

    <section class="panel panel--split">
      <form class="filters" aria-label="Filtres">
        <h2>Filtres</h2>
        <label>Client <input type="text" name="customer" placeholder="Nom du client" /></label>
        <label>Statut
          <select name="status">
            <option>Tous</option>
            <option>Payée</option>
            <option>En cours</option>
          </select>
        </label>
        <label>Note <textarea name="note" rows="3" placeholder="Remarque"></textarea></label>
        <label class="check"><input type="checkbox" name="late" /> Retards seulement</label>
        <button type="submit">Appliquer</button>
      </form>
      <div class="feed">
        <h2>Activité</h2>
        <ul>
          <li>
            <img class="feed__avatar" width="32" height="32" alt="" src={pixel} />
            <p><strong>Camille</strong> a validé la commande <a href="#">#1042</a> hier à 16 h.</p>
          </li>
          <li>
            <img class="feed__avatar" width="32" height="32" alt="" src={pixel} />
            <p><strong>Mehdi</strong> a ajouté une note sur <a href="#">Atelier Lumière</a>.</p>
          </li>
          <li>
            <img class="feed__avatar" width="32" height="32" alt="" src={pixel} />
            <p><strong>Inès</strong> a publié la fiche <a href="#">Lampe de bureau</a>.</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="panel">
      <div class="tabs" role="tablist">
        {#each tabs as tab, index}
          <button type="button" role="tab" aria-selected={index === 0 ? "true" : "false"}>{tab}</button>
        {/each}
      </div>
      <div class="cards">
        {#each products as product}
          <article class="card">
            <img class="card__img" width="320" height="120" alt="" src={pixel} />
            <h3>{product.title}</h3>
            <p>{product.text}</p>
            <button type="button">Ajouter</button>
          </article>
        {/each}
      </div>
    </section>
  </div>
</div>
