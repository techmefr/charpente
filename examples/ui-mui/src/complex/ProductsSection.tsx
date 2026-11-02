import { Box, Button, Card, CardActions, CardContent, CardMedia, Paper, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'
import type { ReactElement } from 'react'
import { GIF } from './gif'

const tabs = ['Populaires', 'Nouveautés', 'Promotions']

const products = [
  { name: 'Carnet à spirale', text: 'Papier recyclé, 120 pages.' },
  { name: 'Stylo plume bleu', text: 'Plume fine, encre incluse.' },
  { name: 'Lampe de bureau', text: 'Bras articulé, LED chaude.' },
]

export const ProductsSection = (): ReactElement => {
  const [tab, setTab] = useState(0)

  return (
    <Paper component="section" sx={{ p: 2 }}>
      <Tabs value={tab} onChange={(_event, value: number) => setTab(value)}>
        {tabs.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mt: 2 }}>
        {products.map((product) => (
          <Card key={product.name} component="article">
            <CardMedia component="img" image={GIF} alt="" width={320} height={120} sx={{ height: 120 }} />
            <CardContent>
              <Typography variant="h6" component="h3">
                {product.name}
              </Typography>
              <Typography>{product.text}</Typography>
            </CardContent>
            <CardActions>
              <Button variant="outlined">Ajouter</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Paper>
  )
}
