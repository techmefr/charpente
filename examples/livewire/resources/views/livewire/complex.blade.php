<x-charpente :loading="$loading" tag="div" data-testid="root" class="dash">
  <aside class="dash__side">
    <p class="dash__brand">Atelier</p>
    <nav aria-label="Principal">
      <a href="#">Tableau de bord</a>
      <a href="#">Commandes</a>
      <a href="#">Clients</a>
      <a href="#">Catalogue</a>
      <a href="#">Réglages</a>
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
        <p class="kpi__label">Chiffre d'affaires</p>
        <strong class="kpi__value">48 210 €</strong>
        <span class="kpi__delta">+12 %</span>
      </article>
      <article class="kpi">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="2" width="16" height="16" fill="currentColor" /></svg>
        <p class="kpi__label">Commandes</p>
        <strong class="kpi__value">1 204</strong>
        <span class="kpi__delta">+4 %</span>
      </article>
      <article class="kpi">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><polygon points="10,2 18,18 2,18" fill="currentColor" /></svg>
        <p class="kpi__label">Panier moyen</p>
        <strong class="kpi__value">40,05 €</strong>
        <span class="kpi__delta">-1 %</span>
      </article>
      <article class="kpi">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="3" /></svg>
        <p class="kpi__label">Retours</p>
        <strong class="kpi__value">2,3 %</strong>
        <span class="kpi__delta">stable</span>
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
          @foreach ([
      ['1001', 'Atelier Lumière', '12/10/2026', '1 240,00 €', 'Payée'],
      ['1002', 'Maison Verdier', '12/10/2026', '389,90 €', 'En cours'],
      ['1003', 'Studio Pivoine', '11/10/2026', '2 075,50 €', 'Payée'],
      ['1004', 'Café du Port', '11/10/2026', '96,00 €', 'Remboursée'],
      ['1005', 'Librairie Nord', '10/10/2026', '512,30 €', 'Payée'],
      ['1006', 'Fleuriste Rose', '10/10/2026', '148,00 €', 'En cours'],
      ['1007', 'Garage Moreau', '09/10/2026', '3 410,00 €', 'Payée'],
      ['1008', 'Boulangerie Alba', '09/10/2026', '74,20 €', 'Payée']
          ] as [$number, $customer, $date, $total, $status])
          <tr wire:key="order-{{ $number }}"><td>{{ $number }}</td><td>{{ $customer }}</td><td>{{ $date }}</td><td>{{ $total }}</td><td><span class="badge">{{ $status }}</span></td></tr>
          @endforeach
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
            <img class="feed__avatar" width="32" height="32" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
            <p><strong>Camille</strong> a validé la commande <a href="#">#1042</a> hier à 16 h.</p>
          </li>
          <li>
            <img class="feed__avatar" width="32" height="32" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
            <p><strong>Mehdi</strong> a ajouté une note sur <a href="#">Atelier Lumière</a>.</p>
          </li>
          <li>
            <img class="feed__avatar" width="32" height="32" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
            <p><strong>Inès</strong> a publié la fiche <a href="#">Lampe de bureau</a>.</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="panel">
      <div class="tabs" role="tablist">
        <button type="button" role="tab" aria-selected="true">Populaires</button>
        <button type="button" role="tab" aria-selected="false">Nouveautés</button>
        <button type="button" role="tab" aria-selected="false">Promotions</button>
      </div>
      <div class="cards">
        @foreach ([
          ['Carnet à spirale', 'Papier recyclé, 120 pages.'],
          ['Stylo plume bleu', 'Plume fine, encre incluse.'],
          ['Lampe de bureau', 'Bras articulé, LED chaude.']
        ] as [$title, $text])
        <article class="card" wire:key="card-{{ $loop->index }}">
          <img class="card__img" width="320" height="120" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
          <h3>{{ $title }}</h3>
          <p>{{ $text }}</p>
          <button type="button">Ajouter</button>
        </article>
        @endforeach
      </div>
    </section>
  </div>
</x-charpente>
