import { useEffect, useMemo, useState } from 'react'
import BarChart from '../../components/charts/BarChart'
import Skeleton from '../../components/ui/Skeleton'
import StatusBadge from '../../components/ui/StatusBadge'
import Table from '../../components/ui/Table'
import { usePageLoading } from '../../hooks/usePageLoading'
import { monthlyRentSeries, rentsSeed } from '../../services/mockData'
import { formatCurrency, formatDate } from '../../utils/formatters'

export default function RentPage() {
  const loading = usePageLoading(350)
  const [rents, setRents] = useState(rentsSeed)

  useEffect(() => {
    const timer = setInterval(() => {
      setRents((prev) => prev.map((item) => (Math.random() > 0.8 ? { ...item, status: item.status === 'PAID' ? 'OVERDUE' : 'PAID' } : item)))
    }, 20000)
    return () => clearInterval(timer)
  }, [])

  const chartData = useMemo(() => monthlyRentSeries, [])

  const columns = [
    { key: 'tenant', label: 'Tenant' },
    { key: 'unit', label: 'Unit' },
    { key: 'dueDate', label: 'Due Date', render: (row) => formatDate(row.dueDate) },
    { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Rent Tracking</h2>
        <p className="text-sm text-soft">Auto-refreshed rent statuses with month-wise trend summary.</p>
      </div>
      {loading ? (
        <>
          <Skeleton className="h-72" />
          <Skeleton className="h-64" />
        </>
      ) : (
        <>
          <Table columns={columns} data={rents} />
          <BarChart data={chartData} />
        </>
      )}
    </div>
  )
}