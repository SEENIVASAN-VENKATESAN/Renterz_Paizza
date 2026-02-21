import { RENTS_KEY } from '../constants/app'
import { rentsSeed } from './mockData'
import api from './api'

const useDemoAuth = import.meta.env.VITE_ENABLE_DEMO_AUTH !== 'false'

function readRents() {
  try {
    const raw = localStorage.getItem(RENTS_KEY)
    if (!raw) {
      localStorage.setItem(RENTS_KEY, JSON.stringify(rentsSeed))
      return [...rentsSeed]
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      localStorage.setItem(RENTS_KEY, JSON.stringify(rentsSeed))
      return [...rentsSeed]
    }
    return parsed
  } catch {
    localStorage.setItem(RENTS_KEY, JSON.stringify(rentsSeed))
    return [...rentsSeed]
  }
}

function writeRents(records) {
  localStorage.setItem(RENTS_KEY, JSON.stringify(records))
}

function deriveStatus(dueDate) {
  const target = new Date(dueDate).setHours(0, 0, 0, 0)
  const today = new Date().setHours(0, 0, 0, 0)
  return target < today ? 'OVERDUE' : 'PENDING'
}

/**
 * Maps backend rent DTO to frontend rent table row shape.
 */
function toRentItem(item) {
  return {
    id: item.rentId,
    allocationId: item.allocationId,
    unitId: item.unitId ?? null,
    unit: item.unitNumber || '-',
    tenant: item.tenantName || 'Tenant',
    tenantEmail: item.tenantEmail || '',
    dueDate: item.dueDate,
    amount: Number(item.amount || 0),
    status: item.status,
    userId: item.tenantId ?? null,
    userEmail: item.tenantEmail || '',
    createdAt: item.createdAt,
  }
}

export const rentService = {
  /**
   * Loads rents from role-specific backend endpoints.
   */
  async listRentsRemote(role) {
    try {
      const endpoint = role === 'OWNER' ? '/api/owner/rents' : '/api/tenant/rents'
      const { data } = await api.get(endpoint)
      const content = Array.isArray(data) ? data : data?.content || []
      return content.map(toRentItem)
    } catch (error) {
      if (!useDemoAuth) throw error
      return readRents()
    }
  },

  listRents() {
    return readRents()
  },

  upsertRent(payload) {
    const rents = readRents()
    const dueDate = String(payload.dueDate || '').trim()
    const unit = String(payload.unit || '').trim()
    const tenant = String(payload.tenant || '').trim()
    const normalizedTenantEmail = String(payload.tenantEmail || '').trim().toLowerCase()
    const amount = Number(payload.amount) || 0

    if (!dueDate || !unit || !tenant || amount <= 0) {
      throw new Error('Tenant, unit, due date and valid amount are required')
    }

    const nextItem = {
      id: Date.now(),
      unitId: payload.unitId || null,
      tenant,
      unit,
      dueDate,
      amount,
      status: deriveStatus(dueDate),
      userId: payload.userId || null,
      userEmail: normalizedTenantEmail,
      tenantEmail: normalizedTenantEmail,
      createdByUserId: payload.createdByUserId || null,
      createdByUserEmail: String(payload.createdByUserEmail || '').trim().toLowerCase(),
      source: payload.source || 'MANUAL',
      createdAt: new Date().toISOString(),
    }

    const matchIndex = rents.findIndex((entry) => {
      const sameUnit = String(entry.unit || '').trim().toUpperCase() === unit.toUpperCase()
      const sameDueDate = String(entry.dueDate || '').trim() === dueDate
      const sameEmail = normalizedTenantEmail && String(entry.userEmail || '').trim().toLowerCase() === normalizedTenantEmail
      const sameTenantName = !normalizedTenantEmail && String(entry.tenant || '').trim().toLowerCase() === tenant.toLowerCase()
      return sameUnit && sameDueDate && (sameEmail || sameTenantName)
    })

    let updated
    if (matchIndex >= 0) {
      const current = rents[matchIndex]
      const merged = {
        ...current,
        ...nextItem,
        id: current.id,
        updatedAt: new Date().toISOString(),
      }
      updated = rents.map((entry, index) => (index === matchIndex ? merged : entry))
    } else {
      updated = [nextItem, ...rents]
    }

    writeRents(updated)
    return matchIndex >= 0 ? updated[matchIndex] : nextItem
  },
}
