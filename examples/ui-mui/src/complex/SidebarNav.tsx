import { Box, Drawer, List, ListItemButton, ListItemText, Typography } from '@mui/material'
import type { ReactElement } from 'react'

const WIDTH = 240

const items = ['Tableau de bord', 'Commandes', 'Clients', 'Catalogue', 'Réglages']

export const SidebarNav = (): ReactElement => (
  <Drawer
    variant="permanent"
    sx={{ width: WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: WIDTH, boxSizing: 'border-box', p: 2 } }}
  >
    <Typography component="p" variant="h6" sx={{ mb: 1 }}>
      Atelier
    </Typography>
    <Box component="nav" aria-label="Principal">
      <List>
        {items.map((item) => (
          <ListItemButton key={item} component="a" href="#">
            <ListItemText primary={item} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  </Drawer>
)
