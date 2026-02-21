import api from './api'
import { createDemoJwt } from '../utils/jwt'
import { ROLES } from '../constants/roles'
import { buildingService } from './buildingService'
import { userService } from './userService'
import { emailService } from './emailService'

const useDemoAuth = import.meta.env.VITE_ENABLE_DEMO_AUTH !== 'false'

/**
 * Converts phone numbers to backend-compatible 10-15 digit strings.
 */
function normalizeMobile(rawMobile) {
  return String(rawMobile || '').replace(/\D/g, '').slice(0, 15)
}

/**
 * Maps register form values to the backend register contract.
 */
function toRegisterRequest(payload) {
  return {
    name: String(payload.fullName || payload.name || '').trim(),
    email: String(payload.email || '').trim().toLowerCase(),
    mobile: normalizeMobile(payload.mobile),
    password: String(payload.password || ''),
    profileImageUrl: String(payload.profileImageUrl || ''),
  }
}

/**
 * Builds a frontend session payload from backend login response.
 */
function toSessionResponse(data) {
  return {
    token: data?.token,
    user: data?.user || {
      email: data?.email || '',
      role: data?.role || '',
    },
  }
}

export const authService = {
  async me() {
    try {
      const { data } = await api.get('/api/common/users/me')
      return {
        id: data?.userId ?? null,
        fullName: data?.name || '',
        email: data?.email || '',
        mobile: data?.mobile || '',
        role: data?.role || '',
        profileImageUrl: data?.profileImageUrl || '',
      }
    } catch (error) {
      if (!useDemoAuth) throw error
      // Demo users (for example SUPER_ADMIN) can run without backend identity endpoint.
      return null
    }
  },

  async login(credentials) {
    if (!useDemoAuth) {
      const { data } = await api.post('/auth/login', credentials)
      return toSessionResponse(data)
    }

    try {
      const { data } = await api.post('/auth/login', credentials)
      return toSessionResponse(data)
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
    const normalizedPayload = toRegisterRequest(payload)

    if (!useDemoAuth) {
      await api.post('/auth/register', normalizedPayload)
      return this.login({
        email: normalizedPayload.email,
        password: normalizedPayload.password,
      })
    }

    try {
      await api.post('/auth/register', normalizedPayload)
      return this.login({
        email: normalizedPayload.email,
        password: normalizedPayload.password,
      })
    } catch {
      const safeRole = ROLES.BUILDING_ADMIN
      const buildingName = String(payload.buildingName || '').trim()
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
        ...payload,
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
