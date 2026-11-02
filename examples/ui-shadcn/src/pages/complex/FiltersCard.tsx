import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function FiltersCard() {
  return (
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
  )
}
