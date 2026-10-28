import { Charpente } from "charpente-react"
import { isLoading, type SearchParams } from "../_lib/state"

export default async function SimplePage({ searchParams }: { searchParams: SearchParams }) {
  const loading = await isLoading(searchParams)
  return (
    <Charpente as="main" data-testid="root" className="page" loading={loading}>
        <header className="page__head">
          <h1>Équipe</h1>
          <p>Quatre collaborateurs</p>
        </header>
        <ul className="people">
          <li className="person">
            <img className="person__avatar" width="48" height="48" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
            <div className="person__body">
              <h2>Camille Durand</h2>
              <p>Cheffe de projet</p>
            </div>
            <a href="mailto:camille@exemple.fr">camille@exemple.fr</a>
          </li>
          <li className="person">
            <img className="person__avatar" width="48" height="48" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
            <div className="person__body">
              <h2>Mehdi Lambert</h2>
              <p>Développeur front</p>
            </div>
            <a href="mailto:mehdi@exemple.fr">mehdi@exemple.fr</a>
          </li>
          <li className="person">
            <img className="person__avatar" width="48" height="48" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
            <div className="person__body">
              <h2>Inès Morel</h2>
              <p>Designeuse</p>
            </div>
            <a href="mailto:ines@exemple.fr">ines@exemple.fr</a>
          </li>
          <li className="person">
            <img className="person__avatar" width="48" height="48" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
            <div className="person__body">
              <h2>Hugo Perrin</h2>
              <p>Développeur back</p>
            </div>
            <a href="mailto:hugo@exemple.fr">hugo@exemple.fr</a>
          </li>
        </ul>
      </Charpente>
  )
}
