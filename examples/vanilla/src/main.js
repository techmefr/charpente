import 'virtual:charpente.css'
import './style.css'

const GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const people = [
  { name: 'Camille Durand', role: 'Cheffe de projet', mail: 'camille@exemple.fr' },
  { name: 'Mehdi Lambert', role: 'Développeur front', mail: 'mehdi@exemple.fr' },
  { name: 'Inès Morel', role: 'Designeuse', mail: 'ines@exemple.fr' },
  { name: 'Hugo Perrin', role: 'Développeur back', mail: 'hugo@exemple.fr' },
]

const placeholder = { name: 'Nom du collaborateur', role: 'Fonction du poste', mail: 'adresse@exemple.fr' }

const list = document.getElementById('list')
const reload = document.getElementById('reload')

const row = (person) => `
  <li class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
    <img class="size-12 rounded-full bg-slate-200" width="48" height="48" alt="" src="${GIF}" />
    <div class="flex-1">
      <h2 class="font-semibold">${person.name}</h2>
      <p class="text-sm text-slate-500">${person.role}</p>
    </div>
    <a class="text-sm text-indigo-600" href="mailto:${person.mail}">${person.mail}</a>
  </li>`

const setLoading = (loading) => {
  list.toggleAttribute('data-charpente-loading', loading)
  list.setAttribute('aria-busy', String(loading))
  list.toggleAttribute('inert', loading)
  reload.disabled = loading
}

const load = () => {
  setLoading(true)
  list.innerHTML = people.map(() => row(placeholder)).join('')
  setTimeout(() => {
    list.innerHTML = people.map(row).join('')
    setLoading(false)
  }, 1800)
}

reload.addEventListener('click', load)
load()
