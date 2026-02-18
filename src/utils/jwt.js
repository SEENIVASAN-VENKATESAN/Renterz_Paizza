export function parseJwt(token) {
  try {
    const base64 = token.split('.')[1]
    const payload = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  const payload = parseJwt(token)
  if (!payload?.exp) {
    return true
  }
  return Date.now() >= payload.exp * 1000
}

export function createDemoJwt(payload = {}, expiresInSeconds = 3600) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSeconds }))
  return `${header}.${body}.signature`
}