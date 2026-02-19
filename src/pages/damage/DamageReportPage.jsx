import { useMemo, useState } from 'react'
import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import StatusBadge from '../../components/ui/StatusBadge'
import { ROLES } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'
import { usePageLoading } from '../../hooks/usePageLoading'
import { damageReportsSeed } from '../../services/mockData'
import { formatCurrency } from '../../utils/formatters'

export default function DamageReportPage() {
  const { user } = useAuth()
  const loading = usePageLoading(350)
  const [reports, setReports] = useState(damageReportsSeed)
  const isAdmin = user?.role === ROLES.ADMIN
  const costImageLabel = useMemo(
    () => (isAdmin ? 'Upload Estimated Cost Image' : 'Estimated Cost Image'),
    [isAdmin]
  )

  const handleCostImageUpload = (reportId, file) => {
    if (!file || !isAdmin) return
    const imageUrl = URL.createObjectURL(file)
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              estimatedCostImage: imageUrl,
            }
          : report
      )
    )
  }

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
        {reports.map((item) => (
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
            <div className="mt-3">
              <p className="mb-1 text-xs font-semibold text-soft">{costImageLabel}</p>
              {item.estimatedCostImage ? (
                <img
                  src={item.estimatedCostImage}
                  alt={`Estimated cost reference for unit ${item.unit}`}
                  className="h-36 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-36 w-full items-center justify-center rounded-xl border border-dashed border-line text-xs text-soft">
                  No estimated cost image uploaded.
                </div>
              )}
              {isAdmin ? (
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-xs text-soft file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-main hover:file:bg-gray-200"
                  onChange={(event) => handleCostImageUpload(item.id, event.target.files?.[0])}
                />
              ) : (
                <p className="mt-2 text-xs text-soft">Only admin can upload the estimated cost image.</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
