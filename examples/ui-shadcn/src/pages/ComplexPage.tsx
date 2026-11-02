import { ActivityCard } from './complex/ActivityCard'
import { FiltersCard } from './complex/FiltersCard'
import { KpiSection } from './complex/KpiSection'
import { OrdersCard } from './complex/OrdersCard'
import { PageHeader } from './complex/PageHeader'
import { ProductsCard } from './complex/ProductsCard'
import { SalesChartCard } from './complex/SalesChartCard'
import { SidebarNav } from './complex/SidebarNav'
import type { PageProps } from './types'

export function ComplexPage({ rootProps }: PageProps) {
  return (
    <div data-testid="root" className="grid min-h-screen grid-cols-[220px_1fr]" {...rootProps}>
      <SidebarNav />
      <div className="grid content-start gap-4 p-6">
        <PageHeader />
        <KpiSection />
        <SalesChartCard />
        <OrdersCard />
        <section className="grid grid-cols-2 gap-4">
          <FiltersCard />
          <ActivityCard />
        </section>
        <ProductsCard />
      </div>
    </div>
  )
}
