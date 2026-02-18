import api from './api'
import { createDemoJwt } from '../utils/jwt'
import { REGISTRATION_ROLES, ROLES } from '../constants/roles'
import { userService } from './userService'

const useDemoAuth = import.meta.env.VITE_ENABLE_DEMO_AUTH !== 'false'

export const authService = {
  async login(credentials) {
    if (!useDemoAuth) {
      const { data } = await api.post('/auth/login', credentials)
      return data
    }

    try {
      const { data } = await api.post('/auth/login', credentials)
      return data
    } catch {
      const user = userService.findByCredentials(credentials.email, credentials.password)
      if (!user) {
        throw new Error('Invalid credentials')
      }
      return {
        token: createDemoJwt({ sub: user.email, role: user.role }),
        user,
      }
    }
  },

  async register(payload) {
    if (!useDemoAuth) {
      const { data } = await api.post('/auth/register', payload)
      return data
    }

    try {
      const { data } = await api.post('/auth/register', payload)
      return data
    } catch {
      const safeRole = REGISTRATION_ROLES.includes(payload.role) ? payload.role : ROLES.TENANT
      const user = userService.addUser({ ...payload, role: safeRole })
      return {
        token: createDemoJwt({ sub: user.email, role: safeRole }),
        user,
      }
    }
  },
}
