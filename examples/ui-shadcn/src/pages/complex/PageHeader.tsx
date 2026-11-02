import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function PageHeader() {
  return (
    <header className="flex items-center gap-3">
      <h1 className="flex-1 text-2xl font-semibold">Tableau de bord</h1>
      <Input type="search" placeholder="Rechercher" aria-label="Rechercher" className="w-60" />
      <Button type="button">Exporter</Button>
    </header>
  )
}
