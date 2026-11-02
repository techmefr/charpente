export function ActivityFeed() {
  return (
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
  )
}
