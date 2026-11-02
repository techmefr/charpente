import { Charpente } from "charpente-react"
import { isLoading, type SearchParams } from "../_lib/state"
import { ActivityFeed } from "./_components/ActivityFeed"
import { FiltersForm } from "./_components/FiltersForm"
import { KpiSection } from "./_components/KpiSection"
import { OrdersPanel } from "./_components/OrdersPanel"
import { PageHeader } from "./_components/PageHeader"
import { ProductsPanel } from "./_components/ProductsPanel"
import { SalesPanel } from "./_components/SalesPanel"
import { SidebarNav } from "./_components/SidebarNav"

export default async function ComplexPage({ searchParams }: { searchParams: SearchParams }) {
  const loading = await isLoading(searchParams)
  return (
    <Charpente as="div" data-testid="root" className="dash" loading={loading}>
      <SidebarNav />
      <div className="dash__main">
        <PageHeader />
        <KpiSection />
        <SalesPanel />
        <OrdersPanel />
        <section className="panel panel--split">
          <FiltersForm />
          <ActivityFeed />
        </section>
        <ProductsPanel />
      </div>
    </Charpente>
  )
}
