import { Avatar, Box, Link, List, ListItem, ListItemAvatar, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import { GIF } from './gif'

const feed = [
  { who: 'Camille', before: ' a validé la commande ', link: '#1042', after: ' hier à 16 h.' },
  { who: 'Mehdi', before: ' a ajouté une note sur ', link: 'Atelier Lumière', after: '.' },
  { who: 'Inès', before: ' a publié la fiche ', link: 'Lampe de bureau', after: '.' },
]

export const ActivityFeed = (): ReactElement => (
  <Box>
    <Typography variant="h6" component="h2">
      Activité
    </Typography>
    <List>
      {feed.map((entry) => (
        <ListItem key={entry.who}>
          <ListItemAvatar sx={{ minWidth: 48 }}>
            <Avatar src={GIF} alt="" sx={{ width: 32, height: 32 }} />
          </ListItemAvatar>
          <Typography component="p">
            <strong>{entry.who}</strong>
            {entry.before}
            <Link href="#">{entry.link}</Link>
            {entry.after}
          </Typography>
        </ListItem>
      ))}
    </List>
  </Box>
)
