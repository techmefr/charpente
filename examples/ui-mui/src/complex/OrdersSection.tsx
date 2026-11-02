import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import type { ReactElement } from 'react'

const heads = ['N°', 'Client', 'Date', 'Total', 'Statut']

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

export const OrdersSection = (): ReactElement => (
  <Paper component="section" sx={{ p: 2 }}>
    <Typography variant="h6" component="h2">
      Commandes récentes
    </Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {heads.map((head) => (
              <TableCell key={head}>{head}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(([id, client, date, total, status]) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{client}</TableCell>
              <TableCell>{date}</TableCell>
              <TableCell>{total}</TableCell>
              <TableCell>
                <Chip size="small" label={status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
)
