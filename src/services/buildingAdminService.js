import api from './api'
import { USER_KEY } from '../constants/app'
import { ROLES } from '../constants/roles'
import { userService } from './userService'

const useDemoAuth = import.meta.env.VITE_ENABLE_DEMO_AUTH !== 'false'

function readSessionUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function makeTempPassword() {
  return `Temp@${Math.random().toString(36).slice(-8)}`
}

export const buildingAdminService = {
  async listUsers() {
    try {
      const { data } = await api.get('/building-admin/users')
      return Array.isArray(data) ? data : data?.items || []
    } catch (error) {
      if (!useDemoAuth) throw error
      const current = readSessionUser()
      return userService
        .listUsers()
        .filter((item) => Number(item.buildingId) === Number(current?.buildingId))
    }
  },

  async createUser(payload) {
    try {
      const { data } = await api.post('/building-admin/users', payload)
      return data
    } catch (error) {
      if (!useDemoAuth) throw error
      const current = readSessionUser()
      return userService.addUser({
        ...payload,
        role: [ROLES.OWNER, ROLES.TENANT].includes(payload.role) ? payload.role : ROLES.TENANT,
        buildingId: current?.buildingId ?? null,
      })
    }
  },

  async removeUser(userId) {
    try {
      await api.delete(`/building-admin/users/${userId}`)
    } catch (error) {
      if (!useDemoAuth) throw error
      userService.removeUser(Number(userId))
    }
  },

  async resetPassword(userId) {
    try {
      const { data } = await api.post(`/building-admin/users/${userId}/reset-password`)
      return data
    } catch (error) {
      if (!useDemoAuth) throw error
      const temporaryPassword = makeTempPassword()
      userService.resetPassword(Number(userId), temporaryPassword)
      return { temporaryPassword }
    }
  },
}
