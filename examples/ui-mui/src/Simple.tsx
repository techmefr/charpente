import { Avatar, Box, Link, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import { loadingProps } from './loading'

const GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const people = [
  { name: 'Camille Durand', role: 'Cheffe de projet', mail: 'camille@exemple.fr' },
  { name: 'Mehdi Lambert', role: 'Développeur front', mail: 'mehdi@exemple.fr' },
  { name: 'Inès Morel', role: 'Designeuse', mail: 'ines@exemple.fr' },
  { name: 'Hugo Perrin', role: 'Développeur back', mail: 'hugo@exemple.fr' },
]

export const Simple = ({ loading }: { loading: boolean }): ReactElement => (
  <Box component="main" data-testid="root" sx={{ maxWidth: 720, p: 3 }} {...loadingProps(loading)}>
    <Box component="header" sx={{ mb: 2 }}>
      <Typography variant="h4" component="h1">
        Équipe
      </Typography>
      <Typography>Quatre collaborateurs</Typography>
    </Box>
    <List>
      {people.map((person) => (
        <ListItem key={person.mail} secondaryAction={<Link href={`mailto:${person.mail}`}>{person.mail}</Link>}>
          <ListItemAvatar>
            <Avatar src={GIF} alt="" sx={{ width: 48, height: 48 }} />
          </ListItemAvatar>
          <ListItemText
            primary={person.name}
            secondary={person.role}
            slotProps={{ primary: { component: 'h2', variant: 'h6' } }}
          />
        </ListItem>
      ))}
    </List>
  </Box>
)
