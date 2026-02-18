import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import Skeleton from '../../components/ui/Skeleton'
import StatusBadge from '../../components/ui/StatusBadge'
import Table from '../../components/ui/Table'
import { PROPERTY_TYPES } from '../../constants/status'
import { usePagination } from '../../hooks/usePagination'
import { propertiesSeed } from '../../services/mockData'

const emptyProperty = { name: '', city: '', type: 'APARTMENT', status: 'ACTIVE', units: 0 }

export default function PropertyListPage() {
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState(propertiesSeed)
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formState, setFormState] = useState(emptyProperty)
  const [deleteId, setDeleteId] = useState(null)

  const filtered = useMemo(() => {
    return properties.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchesCity = cityFilter === 'ALL' || item.city === cityFilter
      const matchesType = typeFilter === 'ALL' || item.type === typeFilter
      return matchesSearch && matchesCity && matchesType
    })
  }, [properties, search, cityFilter, typeFilter])

  const cities = useMemo(() => ['ALL', ...new Set(properties.map((property) => property.city))], [properties])
  const { page, setPage, totalPages, paginatedItems } = usePagination(filtered)

  const openAdd = () => {
    setEditingId(null)
    setFormState(emptyProperty)
    setModalOpen(true)
  }

  const openEdit = (property) => {
    setEditingId(property.id)
    setFormState(property)
    setModalOpen(true)
  }

  const saveProperty = (event) => {
    event.preventDefault()
    if (!formState.name || !formState.city) return

    if (editingId) {
      setProperties((prev) => prev.map((item) => (item.id === editingId ? { ...formState, id: editingId } : item)))
    } else {
      setProperties((prev) => [...prev, { ...formState, id: Date.now() }])
    }
    setModalOpen(false)
  }

  const confirmDelete = () => {
    setProperties((prev) => prev.filter((property) => property.id !== deleteId))
    setDeleteId(null)
  }

  const columns = [
    {
      key: 'name',
      label: 'Property',
      render: (row) => <Link to={`/properties/${row.id}`} className="font-semibold text-teal-700">{row.name}</Link>,
    },
    { key: 'city', label: 'City' },
    { key: 'type', label: 'Type' },
    { key: 'units', label: 'Units' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(row)} className="rounded-lg border border-base px-2.5 py-1">Edit</button>
          <button type="button" onClick={() => setDeleteId(row.id)} className="rounded-lg border border-rose-200 px-2.5 py-1 text-rose-600">Delete</button>
        </div>
      ),
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Properties</h2>
          <p className="text-sm text-soft">Manage assets, types, and city-level inventory.</p>
        </div>
        <Button onClick={openAdd}>Add Property</Button>
      </div>

      <div className="card grid gap-3 p-4 md:grid-cols-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search property" className="input-base" />
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="input-base">
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-base">
          <option value="ALL">ALL</option>
          {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : filtered.length ? (
        <Table columns={columns} data={paginatedItems} />
      ) : (
        <EmptyState title="No properties found" subtitle="Try adjusting search/filter or create a new property." />
      )}
      {filtered.length > 0 ? <Pagination page={page} totalPages={totalPages} onPageChange={setPage} /> : null}

      <Modal open={modalOpen} title={editingId ? 'Edit Property' : 'Add Property'} onClose={() => setModalOpen(false)}>
        <form className="grid gap-3" onSubmit={saveProperty}>
          <input value={formState.name} onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))} placeholder="Property name" className="input-base" />
          <input value={formState.city} onChange={(e) => setFormState((prev) => ({ ...prev, city: e.target.value }))} placeholder="City" className="input-base" />
          <select value={formState.type} onChange={(e) => setFormState((prev) => ({ ...prev, type: e.target.value }))} className="input-base">
            {PROPERTY_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
          <select value={formState.status} onChange={(e) => setFormState((prev) => ({ ...prev, status: e.target.value }))} className="input-base">
            <option>ACTIVE</option>
            <option>INACTIVE</option>
          </select>
          <input type="number" value={formState.units} onChange={(e) => setFormState((prev) => ({ ...prev, units: Number(e.target.value) }))} placeholder="Units" className="input-base" />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Property"
        message="This action will permanently remove the property record. Continue?"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}