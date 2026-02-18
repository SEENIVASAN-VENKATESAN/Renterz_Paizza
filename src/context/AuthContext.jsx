import { useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { setUnauthorizedHandler } from '../services/api'
import { TOKEN_KEY, USER_KEY } from '../constants/app'
import { isTokenExpired, parseJwt } from '../utils/jwt'
import { AuthContext } from './authContextInstance'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [logout])

  useEffect(() => {
    if (!token) return undefined

    if (isTokenExpired(token)) {
      logout()
      return undefined
    }

    const payload = parseJwt(token)
    const msLeft = payload?.exp ? payload.exp * 1000 - Date.now() : 0

    if (msLeft <= 0) {
      logout()
      return undefined
    }

    const timer = setTimeout(() => logout(), msLeft)
    return () => clearTimeout(timer)
  }, [token, logout])

  const persistSession = useCallback((sessionToken, sessionUser) => {
    setToken(sessionToken)
    setUser(sessionUser)
    localStorage.setItem(TOKEN_KEY, sessionToken)
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser))
  }, [])

  const login = useCallback(async (payload) => {
    setLoading(true)
    try {
      const response = await authService.login(payload)
      persistSession(response.token, response.user)
      return response
    } finally {
      setLoading(false)
    }
  }, [persistSession])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const response = await authService.register(payload)
      persistSession(response.token, response.user)
      return response
    } finally {
      setLoading(false)
    }
  }, [persistSession])

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [token, user, loading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
