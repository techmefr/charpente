import CircleIcon from '@mui/icons-material/Circle'
import SquareIcon from '@mui/icons-material/Square'
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory'
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Drawer,
  FormControlLabel,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import type { ReactElement } from 'react'
import { loadingProps } from './loading'

const GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const WIDTH = 240

const nav = ['Tableau de bord', 'Commandes', 'Clients', 'Catalogue', 'Réglages']

const kpis = [
  { icon: <CircleIcon />, label: "Chiffre d'affaires", value: '48 210 €', delta: '+12 %' },
  { icon: <SquareIcon />, label: 'Commandes', value: '1 204', delta: '+4 %' },
  { icon: <ChangeHistoryIcon />, label: 'Panier moyen', value: '40,05 €', delta: '-1 %' },
  { icon: <PanoramaFishEyeIcon />, label: 'Retours', value: '2,3 %', delta: 'stable' },
]

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

const feed = [
  { who: 'Camille', before: ' a validé la commande ', link: '#1042', after: ' hier à 16 h.' },
  { who: 'Mehdi', before: ' a ajouté une note sur ', link: 'Atelier Lumière', after: '.' },
  { who: 'Inès', before: ' a publié la fiche ', link: 'Lampe de bureau', after: '.' },
]

const products = [
  { name: 'Carnet à spirale', text: 'Papier recyclé, 120 pages.' },
  { name: 'Stylo plume bleu', text: 'Plume fine, encre incluse.' },
  { name: 'Lampe de bureau', text: 'Bras articulé, LED chaude.' },
]

const tabs = ['Populaires', 'Nouveautés', 'Promotions']

export const Complex = ({ loading }: { loading: boolean }): ReactElement => {
  const [tab, setTab] = useState(0)

  return (
    <Box data-testid="root" sx={{ display: 'flex' }} {...loadingProps(loading)}>
      <Drawer
        variant="permanent"
        sx={{ width: WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: WIDTH, boxSizing: 'border-box', p: 2 } }}
      >
        <Typography component="p" variant="h6" sx={{ mb: 1 }}>
          Atelier
        </Typography>
        <Box component="nav" aria-label="Principal">
          <List>
            {nav.map((item) => (
              <ListItemButton key={item} component="a" href="#">
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box sx={{ flexGrow: 1, minWidth: 0, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box component="header" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Tableau de bord
          </Typography>
          <TextField type="search" placeholder="Rechercher" size="small" slotProps={{ htmlInput: { 'aria-label': 'Rechercher' } }} />
          <Button variant="contained">Exporter</Button>
        </Box>

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

        <Paper component="section" sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            Ventes sur 12 mois
          </Typography>
          <svg width="600" height="140" viewBox="0 0 600 140" role="img" aria-label="Courbe des ventes">
            <polyline
              points="0,110 50,90 100,100 150,60 200,70 250,40 300,55 350,30 400,45 450,20 500,35 550,15 600,25"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
        </Paper>

        <Paper component="section" sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            Commandes récentes
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['N°', 'Client', 'Date', 'Total', 'Statut'].map((head) => (
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

        <Paper component="section" sx={{ p: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
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
        </Paper>

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
      </Box>
    </Box>
  )
}
