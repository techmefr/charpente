import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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

export function OrdersCard() {
  return (
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
  )
}
