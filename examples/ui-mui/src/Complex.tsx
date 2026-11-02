import { Box } from '@mui/material'
import type { ReactElement } from 'react'
import { FiltersActivitySection } from './complex/FiltersActivitySection'
import { KpiSection } from './complex/KpiSection'
import { OrdersSection } from './complex/OrdersSection'
import { PageHeader } from './complex/PageHeader'
import { ProductsSection } from './complex/ProductsSection'
import { SalesChartSection } from './complex/SalesChartSection'
import { SidebarNav } from './complex/SidebarNav'
import { loadingProps } from './loading'

export const Complex = ({ loading }: { loading: boolean }): ReactElement => (
  <Box data-testid="root" sx={{ display: 'flex' }} {...loadingProps(loading)}>
    <SidebarNav />
    <Box sx={{ flexGrow: 1, minWidth: 0, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader />
      <KpiSection />
      <SalesChartSection />
      <OrdersSection />
      <FiltersActivitySection />
      <ProductsSection />
    </Box>
  </Box>
)
