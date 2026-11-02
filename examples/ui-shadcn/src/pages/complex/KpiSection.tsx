import { Circle, Square, Triangle } from 'lucide-react'
import { Card } from '@/components/ui/card'

const kpis = [
  { label: "Chiffre d'affaires", value: '48 210 €', delta: '+12 %', icon: <Circle className="size-5" fill="currentColor" /> },
  { label: 'Commandes', value: '1 204', delta: '+4 %', icon: <Square className="size-5" fill="currentColor" /> },
  { label: 'Panier moyen', value: '40,05 €', delta: '-1 %', icon: <Triangle className="size-5" fill="currentColor" /> },
  { label: 'Retours', value: '2,3 %', delta: 'stable', icon: <Circle className="size-5" strokeWidth={3} /> },
]

export function KpiSection() {
  return (
    <section aria-label="Indicateurs" className="grid grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="gap-2 p-4">
          {kpi.icon}
          <p className="text-sm text-muted-foreground">{kpi.label}</p>
          <strong className="text-2xl">{kpi.value}</strong>
          <span className="text-sm">{kpi.delta}</span>
        </Card>
      ))}
    </section>
  )
}
