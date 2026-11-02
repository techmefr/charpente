import { Paper } from '@mui/material'
import type { ReactElement } from 'react'
import { ActivityFeed } from './ActivityFeed'
import { FiltersForm } from './FiltersForm'

export const FiltersActivitySection = (): ReactElement => (
  <Paper component="section" sx={{ p: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
    <FiltersForm />
    <ActivityFeed />
  </Paper>
)
