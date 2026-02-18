import { useEffect, useState } from 'react'
import { Eye, EyeOff, Plus, Trash2, Upload, UserPlus } from 'lucide-react'
import Card from '../../components/ui/Card'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Modal from '../../components/ui/Modal'
import Skeleton from '../../components/ui/Skeleton'
import StatCard from '../../components/ui/StatCard'
import { ROLES } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { dashboardByRole } from '../../services/mockData'
import { userService } from '../../services/userService'
import { formatCurrency } from '../../utils/formatters'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [openAddUserModal, setOpenAddUserModal] = useState(false)
  const [showAddUserPassword, setShowAddUserPassword] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    role: ROLES.TENANT,
    password: '',
  })
  const { user } = useAuth()
  const { showToast } = useToast()
  const data = dashboardByRole.ADMIN

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450)
    setUsers(userService.listUsers())
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddUser = (event) => {
    event.preventDefault()

    if (!formData.fullName || !formData.email || !formData.password) {
      showToast('Name, email and password are required', 'error')
      return
    }

    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters', 'error')
      return
    }

    try {
      userService.addUser(formData)
      setUsers(userService.listUsers())
      setFormData({
        fullName: '',
        email: '',
        mobile: '',
        role: ROLES.TENANT,
        password: '',
      })
      setOpenAddUserModal(false)
      setShowAddUserPassword(false)
      showToast('User added successfully', 'success')
    } catch (error) {
      showToast(error.message || 'Unable to add user', 'error')
    }
  }

  const requestRemoveUser = (target) => {
    if (target.email === user?.email) {
      showToast('You cannot remove your own admin account', 'error')
      return
    }
    setDeleteTarget(target)
  }

  const handleRemoveUser = () => {
    if (!deleteTarget) return
    userService.removeUser(deleteTarget.id)
    setUsers(userService.listUsers())
    setDeleteTarget(null)
    showToast('User removed successfully', 'success')
  }

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
        {data.stats.map((stat, index) => (
          <StatCard key={stat.label} title={stat.label} value={stat.value} accent={index % 2 ? 'bg-cyan-500' : 'bg-teal-500'} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold">Revenue Summary</h3>
          <p className="mt-2 text-3xl font-bold text-teal-700">{formatCurrency(data.revenue)}</p>
          <p className="mt-1 text-sm text-soft">Month-to-date net collections across all properties.</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Quick Add</h3>
          <div className="mt-4 space-y-2 text-sm">
            <button type="button" className="flex w-full items-center gap-2 rounded-xl border border-base px-3 py-2 hover:bg-slate-50"><Plus size={15} /> Add Property</button>
            <button type="button" className="flex w-full items-center gap-2 rounded-xl border border-base px-3 py-2 hover:bg-slate-50"><Plus size={15} /> Add Unit</button>
            <button type="button" className="flex w-full items-center gap-2 rounded-xl border border-base px-3 py-2 hover:bg-slate-50"><Upload size={15} /> Upload Ledger</button>
          </div>
        </Card>
      </section>

      <Card>
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <ul className="mt-4 space-y-3 text-sm">
          {data.recentActivity.map((activity) => (
            <li key={activity} className="rounded-xl border border-base px-3 py-2">{activity}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">User Management</h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-base px-2.5 py-1 text-xs text-soft">
              <UserPlus size={13} /> Admin Access
            </span>
            <button
              type="button"
              onClick={() => setOpenAddUserModal(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-base bg-teal-600 text-white transition hover:bg-teal-700"
              aria-label="Add user"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {users.map((entry) => (
            <div key={entry.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-base px-3 py-2 text-sm">
              <span className="min-w-40 font-semibold">{entry.fullName}</span>
              <span className="text-soft">{entry.email}</span>
              <span className="rounded-full border border-base px-2 py-0.5 text-xs">{entry.role}</span>
              <span className="ml-auto text-soft">{entry.mobile || 'N/A'}</span>
              <button
                type="button"
                onClick={() => requestRemoveUser(entry)}
                disabled={entry.email === user?.email}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={openAddUserModal} title="Add User" onClose={() => setOpenAddUserModal(false)}>
        <form className="grid gap-3" onSubmit={handleAddUser}>
          <input name="fullName" value={formData.fullName} onChange={handleChange} className="input-base" placeholder="Full Name" />
          <input name="email" value={formData.email} onChange={handleChange} className="input-base" placeholder="Email" />
          <input name="mobile" value={formData.mobile} onChange={handleChange} className="input-base" placeholder="Mobile (optional)" />
          <select name="role" value={formData.role} onChange={handleChange} className="input-base">
            <option value={ROLES.ADMIN}>ADMIN</option>
            <option value={ROLES.OWNER}>OWNER</option>
            <option value={ROLES.TENANT}>TENANT</option>
          </select>
          <div className="relative">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showAddUserPassword ? 'text' : 'password'}
              className="input-base pr-10"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowAddUserPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-soft"
              aria-label={showAddUserPassword ? 'Hide password' : 'Show password'}
            >
              {showAddUserPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
            <Plus size={15} /> Add User
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove User"
        message={deleteTarget ? `Are you sure you want to remove ${deleteTarget.fullName}?` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleRemoveUser}
      />
    </div>
  )
}
