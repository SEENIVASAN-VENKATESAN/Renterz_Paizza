import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import StatusBadge from '../../components/ui/StatusBadge'
import { usePageLoading } from '../../hooks/usePageLoading'
import { damageReportsSeed } from '../../services/mockData'
import { formatCurrency } from '../../utils/formatters'

export default function DamageReportPage() {
  const loading = usePageLoading(350)

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-80" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Damage Reports</h2>
        <p className="text-sm text-soft">Visual before/after tracking with estimated remediation cost.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {damageReportsSeed.map((item) => (
          <Card key={item.id}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-main">Unit {item.unit}</h3>
              <StatusBadge status={item.status} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-semibold text-soft">Before</p>
                <img src={item.beforeImage} alt="Before damage" className="h-40 w-full rounded-xl object-cover" />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-soft">After</p>
                <img src={item.afterImage} alt="After repair" className="h-40 w-full rounded-xl object-cover" />
              </div>
            </div>
            <p className="mt-3 text-sm text-main">Estimated Cost: <strong>{formatCurrency(item.estimatedCost)}</strong></p>
          </Card>
        ))}
      </div>
    </div>
  )
}