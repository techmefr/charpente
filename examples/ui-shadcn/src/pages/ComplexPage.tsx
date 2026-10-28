import { Circle, ClipboardList, LayoutDashboard, Package, Settings, Square, Triangle, Users } from 'lucide-react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { GIF, type PageProps } from './types'

const nav = [
  { label: 'Tableau de bord', icon: LayoutDashboard },
  { label: 'Commandes', icon: ClipboardList },
  { label: 'Clients', icon: Users },
  { label: 'Catalogue', icon: Package },
  { label: 'Réglages', icon: Settings },
]

const kpis = [
  { label: "Chiffre d'affaires", value: '48 210 €', delta: '+12 %', icon: <Circle className="size-5" fill="currentColor" /> },
  { label: 'Commandes', value: '1 204', delta: '+4 %', icon: <Square className="size-5" fill="currentColor" /> },
  { label: 'Panier moyen', value: '40,05 €', delta: '-1 %', icon: <Triangle className="size-5" fill="currentColor" /> },
  { label: 'Retours', value: '2,3 %', delta: 'stable', icon: <Circle className="size-5" strokeWidth={3} /> },
]

const orders = [
  ['1001', 'Atelier Lumière', '12/10/2026', '1 240,00 €', 'Payée'],
  ['1002', 'Maison Verdier', '12/10/2026', '389,90 €', 'En cours'],
  ['1003', 'Studio Pivoine', '11/10/2026', '2 075,50 €', 'Payée'],
  ['1004', 'Café du Port', '11/10/2026', '96,00 €', 'Remboursée'],
  ['1005', 'Librairie Nord', '10/10/2026', '512,30 €', 'Payée'],
  ['1006', 'Fleuriste Rose', '10/10/2026', '148,00 €', 'En cours'],
  ['1007', 'Garage Moreau', '09/10/2026', '3 410,00 €', 'Payée'],
  ['1008', 'Boulangerie Alba', '09/10/2026', '74,20 €', 'Payée'],
]

const activity = [
  { who: 'Camille', before: 'a validé la commande ', link: '#1042', after: ' hier à 16 h.' },
  { who: 'Mehdi', before: 'a ajouté une note sur ', link: 'Atelier Lumière', after: '.' },
  { who: 'Inès', before: 'a publié la fiche ', link: 'Lampe de bureau', after: '.' },
]

const products = [
  { name: 'Carnet à spirale', text: 'Papier recyclé, 120 pages.' },
  { name: 'Stylo plume bleu', text: 'Plume fine, encre incluse.' },
  { name: 'Lampe de bureau', text: 'Bras articulé, LED chaude.' },
]

const sales = '0,110 50,90 100,100 150,60 200,70 250,40 300,55 350,30 400,45 450,20 500,35 550,15 600,25'

export function ComplexPage({ rootProps }: PageProps) {
  return (
    <div data-testid="root" className="grid min-h-screen grid-cols-[220px_1fr]" {...rootProps}>
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
      <div className="grid content-start gap-4 p-6">
        <header className="flex items-center gap-3">
          <h1 className="flex-1 text-2xl font-semibold">Tableau de bord</h1>
          <Input type="search" placeholder="Rechercher" aria-label="Rechercher" className="w-60" />
          <Button type="button">Exporter</Button>
        </header>

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

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Ventes sur 12 mois</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <svg className="max-w-full text-primary" width="600" height="140" viewBox="0 0 600 140" role="img" aria-label="Courbe des ventes">
              <polyline points={sales} fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Commandes récentes</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(([id, customer, date, total, status]) => (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{customer}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{total}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <section className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <form aria-label="Filtres" className="grid gap-3">
                <h2 className="font-semibold">Filtres</h2>
                <div className="grid gap-1.5">
                  <Label htmlFor="customer">Client</Label>
                  <Input id="customer" type="text" name="customer" placeholder="Nom du client" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="status">Statut</Label>
                  <Select name="status" defaultValue="all">
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="paid">Payée</SelectItem>
                      <SelectItem value="pending">En cours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="note">Note</Label>
                  <Textarea id="note" name="note" rows={3} placeholder="Remarque" />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="late" name="late" />
                  <Label htmlFor="late">Retards seulement</Label>
                </div>
                <Button type="submit">Appliquer</Button>
              </form>
            </CardContent>
          </Card>
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
        </section>

        <Card>
          <CardContent>
            <Tabs defaultValue="popular">
              <TabsList>
                <TabsTrigger value="popular">Populaires</TabsTrigger>
                <TabsTrigger value="new">Nouveautés</TabsTrigger>
                <TabsTrigger value="sale">Promotions</TabsTrigger>
              </TabsList>
              <TabsContent value="popular" className="grid grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.name} className="overflow-hidden pt-0">
                    <img className="h-[120px] w-full" width={320} height={120} alt="" src={GIF} />
                    <CardHeader>
                      <CardTitle>
                        <h3>{product.name}</h3>
                      </CardTitle>
                      <CardDescription>{product.text}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button type="button" variant="outline">
                        Ajouter
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
