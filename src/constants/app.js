export const TOKEN_KEY = 'rp_access_token'
export const USER_KEY = 'rp_user'
export const USERS_KEY = 'rp_users'

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 12000,
}
