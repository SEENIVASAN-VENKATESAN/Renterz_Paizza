import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import StatusBadge from '../../components/ui/StatusBadge'
import { usePageLoading } from '../../hooks/usePageLoading'
import { dashboardByRole } from '../../services/mockData'
import { formatDate } from '../../utils/formatters'

export default function TenantDashboard() {
  const loading = usePageLoading()
  const data = dashboardByRole.TENANT

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold">My Unit Details</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div><p className="text-soft">Unit</p><p className="font-semibold">{data.unit.unitNo}</p></div>
          <div><p className="text-soft">Building</p><p className="font-semibold">{data.unit.building}</p></div>
          <div><p className="text-soft">Rent Status</p><StatusBadge status={data.unit.rentStatus} /></div>
          <div><p className="text-soft">Due Date</p><p className="font-semibold">{formatDate(data.unit.dueDate)}</p></div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]">Pay Now</button>
          <button type="button" className="rounded-xl border border-base px-4 py-2 text-sm font-semibold">Raise Complaint</button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold">Communication History</h3>
        <ul className="mt-4 space-y-2 text-sm">
          {data.communication.map((message) => (
            <li key={message} className="rounded-xl border border-base px-3 py-2">{message}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
