import { PAYMENTS_KEY } from '../constants/app'
import { ROLES } from '../constants/roles'
import { paymentsSeed, rentsSeed } from './mockData'
import api from './api'

const useDemoAuth = import.meta.env.VITE_ENABLE_DEMO_AUTH !== 'false'

function readPayments() {
  try {
    const raw = localStorage.getItem(PAYMENTS_KEY)
    const parsed = raw ? JSON.parse(raw) : paymentsSeed
    if (!Array.isArray(parsed)) return [...paymentsSeed]
    return parsed
  } catch {
    return [...paymentsSeed]
  }
}

function writePayments(records) {
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(records))
}

function getUnitAmount(unitNo) {
  const matched = rentsSeed.find((item) => item.unit === unitNo)
  return matched?.amount || 0
}

/**
 * Transforms backend payment DTO to the payment table shape.
 */
function toPaymentItem(item) {
  return {
    id: item.paymentId,
    tenant: item.tenantName || 'Tenant',
    amount: Number(item.amount || 0),
    date: String(item.paymentDate || '').slice(0, 10),
    status: item.status,
    method: item.paymentMode,
    unit: item.unitNumber || '',
    userId: item.userId ?? null,
  }
}

export const paymentService = {
  /**
   * Loads current user's payments from backend.
   */
  async listPaymentsRemote() {
    try {
      const { data } = await api.get('/api/common/payments')
      const content = Array.isArray(data) ? data : data?.content || []
      return content.map(toPaymentItem)
    } catch (error) {
      if (!useDemoAuth) throw error
      return readPayments()
    }
  },

  /**
   * Requests a payment gateway checkout session in safe/test mode.
   */
  async initGatewayCheckout(payload) {
    const request = {
      rentId: payload.rentId ?? null,
      maintenanceId: payload.maintenanceId ?? null,
      damageId: payload.damageId ?? null,
      amount: Number(payload.amount || 0),
      paymentMode: payload.paymentMode || 'UPI',
      successUrl: payload.successUrl || window.location.href,
      cancelUrl: payload.cancelUrl || window.location.href,
    }
    const { data } = await api.post('/api/common/payments/gateway/init', request)
    return data
  },

  listPayments() {
    return readPayments()
  },

  listPaymentsForUser(user) {
    const payments = readPayments()
    if (!user) return []
    if (user.role === ROLES.BUILDING_ADMIN || user.role === ROLES.ADMIN) return payments

    return payments.filter((item) => {
      const byUserId = item.userId && item.userId === user.id
      const byEmail = item.userEmail && item.userEmail.toLowerCase() === user.email?.toLowerCase()
      const byName = item.tenant && item.tenant.toLowerCase() === user.fullName?.toLowerCase()
      return byUserId || byEmail || byName
    })
  },

  addTenantPayment({ tenant, unit, method = 'UPI', userId = null, userEmail = '' }) {
    const payments = readPayments()
    const today = new Date().toISOString().slice(0, 10)
    const nextPayment = {
      id: Date.now(),
      tenant,
      amount: getUnitAmount(unit),
      date: today,
      status: 'SUCCESS',
      method,
      unit,
      userId,
      userEmail,
    }
    const updated = [nextPayment, ...payments]
    writePayments(updated)
    return nextPayment
  },
}
