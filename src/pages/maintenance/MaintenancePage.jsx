import { Plus } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Skeleton from '../../components/ui/Skeleton'
import StatusBadge from '../../components/ui/StatusBadge'
import Table from '../../components/ui/Table'
import { MAINTENANCE_BILLS_KEY } from '../../constants/app'
import { usePageLoading } from '../../hooks/usePageLoading'
import { maintenanceSeed } from '../../services/mockData'
import { inventoryService } from '../../services/inventoryService'
import { formatDate } from '../../utils/formatters'

const newServiceDefaults = {
  unitId: '',
  issue: '',
  dueDate: '',
  amount: '',
  status: 'OPEN',
}

function readMaintenance() {
  try {
    const raw = localStorage.getItem(MAINTENANCE_BILLS_KEY)
    if (!raw) {
      localStorage.setItem(MAINTENANCE_BILLS_KEY, JSON.stringify(maintenanceSeed))
      return [...maintenanceSeed]
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [...maintenanceSeed]
  } catch {
    return [...maintenanceSeed]
  }
}

function writeMaintenance(records) {
  localStorage.setItem(MAINTENANCE_BILLS_KEY, JSON.stringify(records))
}

export default function MaintenancePage() {
  const loading = usePageLoading(350)
  const units = inventoryService.getUnits()
  const [tickets, setTickets] = useState(() => readMaintenance())
  const [openAdd, setOpenAdd] = useState(false)
  const [form, setForm] = useState(newServiceDefaults)

  const markPaid = (id) => {
    setTickets((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, paid: true } : item))
      writeMaintenance(updated)
      return updated
    })
  }

  const addService = (event) => {
    event.preventDefault()
    const selectedUnit = units.find((unit) => Number(unit.id) === Number(form.unitId))
    if (!selectedUnit || !form.issue.trim() || !form.dueDate || Number(form.amount) <= 0) return

    const next = {
      id: new Date().getTime(),
      unitId: selectedUnit.id,
      unit: selectedUnit.unitNo,
      issue: form.issue.trim(),
      dueDate: form.dueDate,
      status: form.status,
      paid: false,
      amount: Number(form.amount),
      billMonth: String(form.dueDate).slice(0, 7),
    }

    const updated = [next, ...tickets]
    setTickets(updated)
    writeMaintenance(updated)
    setForm(newServiceDefaults)
    setOpenAdd(false)
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Maintenance</h2>
          <p className="text-sm text-soft">Track service tickets, due dates, and settlement status.</p>
        </div>
        <Button onClick={() => setOpenAdd(true)}><Plus size={14} /> Add Service</Button>
      </div>
      {loading ? <Skeleton className="h-72" /> : <Table columns={columns} data={tickets} />}

      <Modal open={openAdd} title="Add Maintenance Service" onClose={() => setOpenAdd(false)}>
        <form className="grid gap-3" onSubmit={addService}>
          <select
            className="input-base"
            value={form.unitId}
            onChange={(event) => setForm((prev) => ({ ...prev, unitId: event.target.value }))}
          >
            <option value="">Select Unit</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>{unit.unitNo} | {unit.property}</option>
            ))}
          </select>
          <input
            className="input-base"
            placeholder="Service / Issue (e.g. Plumbing check)"
            value={form.issue}
            onChange={(event) => setForm((prev) => ({ ...prev, issue: event.target.value }))}
          />
          <div className="grid gap-2 sm:grid-cols-3">
            <input
              type="date"
              className="input-base"
              value={form.dueDate}
              onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
            />
            <input
              type="number"
              min="1"
              className="input-base"
              placeholder="Amount"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
            />
            <select
              className="input-base"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpenAdd(false)}>Cancel</Button>
            <Button type="submit">Add Service</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
