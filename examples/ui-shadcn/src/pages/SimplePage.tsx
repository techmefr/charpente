import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { GIF, type PageProps } from './types'

const people = [
  { name: 'Camille Durand', role: 'Cheffe de projet', email: 'camille@exemple.fr' },
  { name: 'Mehdi Lambert', role: 'Développeur front', email: 'mehdi@exemple.fr' },
  { name: 'Inès Morel', role: 'Designeuse', email: 'ines@exemple.fr' },
  { name: 'Hugo Perrin', role: 'Développeur back', email: 'hugo@exemple.fr' },
]

export function SimplePage({ rootProps }: PageProps) {
  return (
    <main data-testid="root" className="mx-auto max-w-[720px] px-4 py-6" {...rootProps}>
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Équipe</h1>
        <p className="text-muted-foreground">Quatre collaborateurs</p>
      </header>
      <ul className="grid gap-3">
        {people.map((person) => (
          <li key={person.email}>
            <Card className="flex-row items-center gap-3 p-3">
              <Avatar className="size-12">
                <AvatarImage src={GIF} alt="" />
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold">{person.name}</h2>
                <p className="text-sm text-muted-foreground">{person.role}</p>
              </div>
              <a className="text-sm text-primary underline underline-offset-4" href={`mailto:${person.email}`}>
                {person.email}
              </a>
            </Card>
          </li>
        ))}
      </ul>
    </main>
  )
}
