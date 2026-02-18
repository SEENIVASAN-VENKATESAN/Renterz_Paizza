import { useState } from 'react'
import { usePageLoading } from '../../hooks/usePageLoading'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Skeleton from '../../components/ui/Skeleton'
import StatusBadge from '../../components/ui/StatusBadge'
import Table from '../../components/ui/Table'
import { unitsSeed } from '../../services/mockData'

const defaultUnit = { unitNo: '', property: '', owner: '', floor: 1, status: 'AVAILABLE' }

export default function UnitPage() {
  const loading = usePageLoading(350)
  const [units, setUnits] = useState(unitsSeed)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultUnit)
  const [showModal, setShowModal] = useState(false)
  const [allocating, setAllocating] = useState(null)
  const [allocationOwner, setAllocationOwner] = useState('')

  const openNew = () => {
    setEditingId(null)
    setForm(defaultUnit)
    setShowModal(true)
  }

  const openEdit = (unit) => {
    setEditingId(unit.id)
    setForm(unit)
    setShowModal(true)
  }

  const saveUnit = (event) => {
    event.preventDefault()
    if (editingId) {
      setUnits((prev) => prev.map((item) => (item.id === editingId ? { ...form, id: editingId } : item)))
    } else {
      setUnits((prev) => [...prev, { ...form, id: Date.now() }])
    }
    setShowModal(false)
  }

  const allocate = () => {
    if (!allocationOwner) return
    setUnits((prev) => prev.map((item) => (item.id === allocating ? { ...item, owner: allocationOwner, status: 'OCCUPIED' } : item)))
    setAllocating(null)
    setAllocationOwner('')
  }

  const columns = [
    { key: 'unitNo', label: 'Unit No' },
    { key: 'property', label: 'Property' },
    { key: 'owner', label: 'Owner' },
    { key: 'floor', label: 'Floor' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button type="button" className="rounded-lg border border-base px-2.5 py-1" onClick={() => openEdit(row)}>Edit</button>
          <button type="button" className="rounded-lg border border-base px-2.5 py-1" onClick={() => setAllocating(row.id)}>Allocate</button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Units</h2>
          <p className="text-sm text-soft">Manage unit lifecycle, owner mapping, and occupancy.</p>
        </div>
        <Button onClick={openNew}>Add Unit</Button>
      </div>

      {loading ? <Skeleton className="h-72" /> : <Table columns={columns} data={units} />}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Unit' : 'Add Unit'}>
        <form className="grid gap-3" onSubmit={saveUnit}>
          <input value={form.unitNo} onChange={(e) => setForm((prev) => ({ ...prev, unitNo: e.target.value }))} placeholder="Unit Number" className="input-base" />
          <input value={form.property} onChange={(e) => setForm((prev) => ({ ...prev, property: e.target.value }))} placeholder="Property" className="input-base" />
          <input value={form.owner} onChange={(e) => setForm((prev) => ({ ...prev, owner: e.target.value }))} placeholder="Owner" className="input-base" />
          <input type="number" value={form.floor} onChange={(e) => setForm((prev) => ({ ...prev, floor: Number(e.target.value) }))} placeholder="Floor" className="input-base" />
          <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="input-base">
            <option>AVAILABLE</option>
            <option>OCCUPIED</option>
            <option>INACTIVE</option>
          </select>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(allocating)} title="Allocate Unit" onClose={() => setAllocating(null)}>
        <div className="space-y-3">
          <input value={allocationOwner} onChange={(e) => setAllocationOwner(e.target.value)} placeholder="Assign owner" className="input-base" />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setAllocating(null)}>Cancel</Button>
            <Button onClick={allocate}>Allocate</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}