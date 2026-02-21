import { PAYMENTS_KEY } from '../constants/app'
import { ROLES } from '../constants/roles'
import { paymentsSeed, rentsSeed } from './mockData'

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

export const paymentService = {
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
