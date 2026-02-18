import { useMemo, useState } from 'react'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Skeleton from '../../components/ui/Skeleton'
import StatusBadge from '../../components/ui/StatusBadge'
import Table from '../../components/ui/Table'
import { usePageLoading } from '../../hooks/usePageLoading'
import { paymentsSeed } from '../../services/mockData'
import { formatCurrency, formatDate } from '../../utils/formatters'

export default function PaymentPage() {
  const loading = usePageLoading(350)
  const [payments] = useState(paymentsSeed)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(
    () => payments.filter((item) => {
      const statusOk = statusFilter === 'ALL' || item.status === statusFilter
      const dateOk = !dateFilter || item.date === dateFilter
      return statusOk && dateOk
    }),
    [payments, statusFilter, dateFilter]
  )

  const downloadReceipt = (payment) => {
    const content = `Receipt #${payment.id}\nTenant: ${payment.tenant}\nAmount: ${formatCurrency(payment.amount)}\nDate: ${payment.date}\nStatus: ${payment.status}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `receipt-${payment.id}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const columns = [
    { key: 'id', label: 'Payment ID' },
    { key: 'tenant', label: 'Tenant' },
    { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button variant="secondary" onClick={() => setSelected(row)} className="px-3 py-1 text-xs">
          Details
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Payments</h2>
        <p className="text-sm text-soft">Transaction monitoring with receipt download support.</p>
      </div>

      <div className="card grid gap-3 p-4 md:grid-cols-2">
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input-base" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-base">
          <option value="ALL">ALL</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="FAILED">FAILED</option>
          <option value="PENDING">PENDING</option>
        </select>
      </div>

      {loading ? <Skeleton className="h-72" /> : <Table columns={columns} data={filtered} />}

      <Modal open={Boolean(selected)} title="Payment Details" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-3 text-sm">
            <div className="rounded-xl border border-base p-3 text-main">
              <p><strong>ID:</strong> {selected.id}</p>
              <p><strong>Tenant:</strong> {selected.tenant}</p>
              <p><strong>Method:</strong> {selected.method}</p>
              <p><strong>Amount:</strong> {formatCurrency(selected.amount)}</p>
              <p><strong>Date:</strong> {formatDate(selected.date)}</p>
            </div>
            <div className="flex justify-between">
              <StatusBadge status={selected.status} />
              <Button onClick={() => downloadReceipt(selected)}>Download Receipt</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}