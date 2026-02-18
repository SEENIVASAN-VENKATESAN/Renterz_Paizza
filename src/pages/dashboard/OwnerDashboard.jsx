import BarChart from '../../components/charts/BarChart'
import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import StatCard from '../../components/ui/StatCard'
import { usePageLoading } from '../../hooks/usePageLoading'
import { dashboardByRole } from '../../services/mockData'

export default function OwnerDashboard() {
  const loading = usePageLoading()
  const data = dashboardByRole.OWNER

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-56" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.label} title={stat.label} value={stat.value} />
        ))}
      </section>

      <BarChart data={data.paymentHistory.map((item) => ({ month: item.month, value: item.amount }))} />

      <Card>
        <h3 className="text-lg font-semibold">Payment History</h3>
        <div className="mt-3 space-y-2 text-sm">
          {data.paymentHistory.map((item) => (
            <div key={item.month} className="flex items-center justify-between rounded-xl border border-base px-3 py-2">
              <span>{item.month}</span>
              <strong>${item.amount.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
