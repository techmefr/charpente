import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { GIF } from '../types'

const activity = [
  { who: 'Camille', before: 'a validé la commande ', link: '#1042', after: ' hier à 16 h.' },
  { who: 'Mehdi', before: 'a ajouté une note sur ', link: 'Atelier Lumière', after: '.' },
  { who: 'Inès', before: 'a publié la fiche ', link: 'Lampe de bureau', after: '.' },
]

export function ActivityCard() {
  return (
    <Card>
      <CardContent className="grid gap-3">
        <h2 className="font-semibold">Activité</h2>
        <ul className="grid gap-3">
          {activity.map((entry) => (
            <li key={entry.who} className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={GIF} alt="" />
              </Avatar>
              <p className="text-sm">
                <strong>{entry.who}</strong> {entry.before}
                <a className="underline underline-offset-4" href="#">
                  {entry.link}
                </a>
                {entry.after}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
