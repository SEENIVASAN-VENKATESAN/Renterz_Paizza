import { useState } from 'react'
import Skeleton from '../../components/ui/Skeleton'
import StatusBadge from '../../components/ui/StatusBadge'
import Table from '../../components/ui/Table'
import { usePageLoading } from '../../hooks/usePageLoading'
import { maintenanceSeed } from '../../services/mockData'
import { formatDate } from '../../utils/formatters'

export default function MaintenancePage() {
  const loading = usePageLoading(350)
  const [tickets, setTickets] = useState(maintenanceSeed)

  const markPaid = (id) => {
    setTickets((prev) => prev.map((item) => (item.id === id ? { ...item, paid: true } : item)))
  }

  const columns = [
    { key: 'unit', label: 'Unit' },
    { key: 'issue', label: 'Issue' },
    { key: 'dueDate', label: 'Due Date', render: (row) => formatDate(row.dueDate) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'paid',
      label: 'Paid',
      render: (row) => (
        row.paid ? <StatusBadge status="PAID" /> : <button type="button" onClick={() => markPaid(row.id)} className="rounded-lg border border-base px-2.5 py-1">Mark as Paid</button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Maintenance</h2>
        <p className="text-sm text-soft">Track service tickets, due dates, and settlement status.</p>
      </div>
      {loading ? <Skeleton className="h-72" /> : <Table columns={columns} data={tickets} />}
    </div>
  )
}