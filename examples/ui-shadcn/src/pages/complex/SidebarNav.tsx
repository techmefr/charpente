import { ClipboardList, LayoutDashboard, Package, Settings, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

const nav = [
  { label: 'Tableau de bord', icon: LayoutDashboard },
  { label: 'Commandes', icon: ClipboardList },
  { label: 'Clients', icon: Users },
  { label: 'Catalogue', icon: Package },
  { label: 'Réglages', icon: Settings },
]

export function SidebarNav() {
  return (
    <aside className="border-r bg-card p-4">
      <p className="mb-4 text-lg font-semibold">Atelier</p>
      <nav aria-label="Principal" className="grid gap-1">
        {nav.map(({ label, icon: Icon }) => (
          <Button key={label} variant="ghost" className="justify-start" asChild>
            <a href="#">
              <Icon />
              {label}
            </a>
          </Button>
        ))}
      </nav>
    </aside>
  )
}
