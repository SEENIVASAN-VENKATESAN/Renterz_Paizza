import api from './api'
import { createDemoJwt } from '../utils/jwt'
import { REGISTRATION_ROLES, ROLES } from '../constants/roles'
import { buildingService } from './buildingService'
import { userService } from './userService'
import { emailService } from './emailService'

const useDemoAuth = import.meta.env.VITE_ENABLE_DEMO_AUTH !== 'false'

export const authService = {
  async me() {
    const { data } = await api.get('/auth/me')
    return data
  },

  async login(credentials) {
    if (!useDemoAuth) {
      const { data } = await api.post('/auth/login', credentials)
      return {
        token: data.token,
        user: data.user || null,
      }
    }

    try {
      const { data } = await api.post('/auth/login', credentials)
      return {
        token: data.token,
        user: data.user || null,
      }
    } catch {
      const user = userService.findByCredentials(credentials.email, credentials.password)
      if (!user) {
        throw new Error('Invalid credentials')
      }
      return {
        token: createDemoJwt({
          sub: user.email,
          userId: user.id,
          role: user.role,
          buildingId: user.buildingId ?? null,
        }),
        user,
      }
    }
  },

  async register(payload) {
    const normalizedPayload = {
      ...payload,
      role: ROLES.BUILDING_ADMIN,
    }

    if (!useDemoAuth) {
      const { data } = await api.post('/auth/register', normalizedPayload)
      return {
        token: data.token,
        user: data.user || null,
      }
    }

    try {
      const { data } = await api.post('/auth/register', normalizedPayload)
      return {
        token: data.token,
        user: data.user || null,
      }
    } catch {
      const safeRole = REGISTRATION_ROLES.includes(normalizedPayload.role) ? normalizedPayload.role : ROLES.BUILDING_ADMIN
      const buildingName = String(normalizedPayload.buildingName || '').trim()
      const dbName = buildingName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 40) || `building_${Date.now()}`
      const building = await buildingService.createBuilding({
        name: buildingName || 'New Building',
        dbName,
        dbUrl: `jdbc:postgresql://localhost:5432/${dbName}`,
      })

      const user = userService.addUser({
        ...normalizedPayload,
        role: safeRole,
        buildingId: building?.id ?? Date.now(),
        buildingName: building?.name || buildingName || 'New Building',
      })
      return {
        token: createDemoJwt({
          sub: user.email,
          userId: user.id,
          role: safeRole,
          buildingId: user.buildingId ?? null,
        }),
        user,
      }
    }
  },

  async requestPasswordReset(email) {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    if (!useDemoAuth) {
      const { data } = await api.post('/auth/forgot-password', { email: normalizedEmail })
      return data
    }

    try {
      const { data } = await api.post('/auth/forgot-password', { email: normalizedEmail })
      return data
    } catch {
      const user = userService.findByEmail(normalizedEmail)
      if (!user) {
        return { message: 'If this email exists, a reset password email has been sent.' }
      }

      const temporaryPassword = `Temp@${Math.random().toString(36).slice(-8)}`
      userService.resetPassword(user.id, temporaryPassword)

      try {
        await emailService.sendRecoveryPassword({
          toEmail: normalizedEmail,
          toName: user.fullName,
          temporaryPassword,
        })
      } catch (error) {
        return {
          message: error?.message || 'Temporary password generated, but email could not be sent.',
          temporaryPassword,
        }
      }

      return {
        message: 'Recovery password sent to your email.',
      }
    }
  },
}
