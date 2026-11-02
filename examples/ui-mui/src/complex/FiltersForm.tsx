import { Box, Button, Checkbox, FormControlLabel, MenuItem, TextField, Typography } from '@mui/material'
import type { ReactElement } from 'react'

export const FiltersForm = (): ReactElement => (
  <Box component="form" aria-label="Filtres" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Typography variant="h6" component="h2">
      Filtres
    </Typography>
    <TextField label="Client" name="customer" placeholder="Nom du client" size="small" />
    <TextField select label="Statut" name="status" size="small" defaultValue="Tous">
      <MenuItem value="Tous">Tous</MenuItem>
      <MenuItem value="Payée">Payée</MenuItem>
      <MenuItem value="En cours">En cours</MenuItem>
    </TextField>
    <TextField label="Note" name="note" placeholder="Remarque" multiline minRows={3} />
    <FormControlLabel control={<Checkbox name="late" />} label="Retards seulement" />
    <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
      Appliquer
    </Button>
  </Box>
)
