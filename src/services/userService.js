import { ROLES } from '../constants/roles'
import { USERS_KEY } from '../constants/app'

const defaultUsers = [
  {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@renterz.com',
    mobile: '9876543210',
    role: ROLES.ADMIN,
    password: 'password123',
  },
  {
    id: 2,
    fullName: 'Owner User',
    email: 'owner@renterz.com',
    mobile: '9876543211',
    role: ROLES.OWNER,
    password: 'password123',
  },
  {
    id: 3,
    fullName: 'Tenant User',
    email: 'tenant@renterz.com',
    mobile: '9876543212',
    role: ROLES.TENANT,
    password: 'password123',
  },
]

function readUsers() {
  const raw = localStorage.getItem(USERS_KEY)
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
    return [...defaultUsers]
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
      return [...defaultUsers]
    }
    return parsed
  } catch {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
    return [...defaultUsers]
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user
  return safeUser
}

export const userService = {
  listUsers() {
    return readUsers().map(sanitizeUser)
  },

  findByCredentials(email, password) {
    const normalized = email.trim().toLowerCase()
    const user = readUsers().find((item) => item.email.toLowerCase() === normalized && item.password === password)
    return user ? sanitizeUser(user) : null
  },

  addUser(payload) {
    const users = readUsers()
    const email = payload.email.trim().toLowerCase()
    const mobile = payload.mobile?.trim() || ''
    const emailExists = users.some((item) => item.email.toLowerCase() === email)
    const mobileExists = mobile ? users.some((item) => (item.mobile || '').trim() === mobile) : false

    if (emailExists || mobileExists) {
      throw new Error('Email or mobile already used')
    }

    const nextUser = {
      id: Date.now(),
      fullName: payload.fullName.trim(),
      email,
      mobile,
      role: payload.role,
      password: payload.password,
    }

    const nextUsers = [...users, nextUser]
    writeUsers(nextUsers)
    return sanitizeUser(nextUser)
  },

  removeUser(id) {
    const users = readUsers()
    const nextUsers = users.filter((item) => item.id !== id)
    writeUsers(nextUsers)
    return nextUsers.map(sanitizeUser)
  },
}
