import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory'
import CircleIcon from '@mui/icons-material/Circle'
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye'
import SquareIcon from '@mui/icons-material/Square'
import { Box, Card, CardContent, Chip, Typography } from '@mui/material'
import type { ReactElement } from 'react'

const kpis = [
  { icon: <CircleIcon />, label: "Chiffre d'affaires", value: '48 210 €', delta: '+12 %' },
  { icon: <SquareIcon />, label: 'Commandes', value: '1 204', delta: '+4 %' },
  { icon: <ChangeHistoryIcon />, label: 'Panier moyen', value: '40,05 €', delta: '-1 %' },
  { icon: <PanoramaFishEyeIcon />, label: 'Retours', value: '2,3 %', delta: 'stable' },
]

export const KpiSection = (): ReactElement => (
  <Box component="section" aria-label="Indicateurs" sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
    {kpis.map((kpi) => (
      <Card key={kpi.label} component="article">
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
          {kpi.icon}
          <Typography>{kpi.label}</Typography>
          <Typography component="strong" variant="h5">
            {kpi.value}
          </Typography>
          <Chip size="small" label={kpi.delta} />
        </CardContent>
      </Card>
    ))}
  </Box>
)
