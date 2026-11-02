import { Box, Button, TextField, Typography } from '@mui/material'
import type { ReactElement } from 'react'

export const PageHeader = (): ReactElement => (
  <Box component="header" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
      Tableau de bord
    </Typography>
    <TextField type="search" placeholder="Rechercher" size="small" slotProps={{ htmlInput: { 'aria-label': 'Rechercher' } }} />
    <Button variant="contained">Exporter</Button>
  </Box>
)
