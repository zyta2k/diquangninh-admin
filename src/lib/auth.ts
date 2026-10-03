import { hasAdminAccess } from './auth-guard'
import type { AuthUser } from './auth-guard'

const AUTH_STORAGE_KEY = 'diquangninh-admin-session'
const apiUrl = import.meta.env.VITE_API_URL ?? 'https://dev-api.diquangninh.vn'

type StoredSession = {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

type LoginResponse = {
  jwt?: string
  jwtRefresh?: string
  user?: AuthUser
  message?: string
}

function canUseStorage() {
  return typeof window !== 'undefined'
}

export function getStoredSession(): StoredSession | null {
  if (!canUseStorage()) return null

  try {
    const value = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!value) return null
    const session = JSON.parse(value) as Record<string, unknown>
    return typeof session.accessToken === 'string' &&
      typeof session.refreshToken === 'string' &&
      typeof session.user === 'object' &&
      session.user !== null
      ? (session as StoredSession)
      : null
  } catch {
    return null
  }
}

export function getAccessToken() {
  return getStoredSession()?.accessToken ?? null
}

export function clearSession() {
  if (canUseStorage()) window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

function saveSession(session: StoredSession) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export async function getCurrentUser(token: string): Promise<AuthUser | null> {
  const response = await fetch(`${apiUrl}/auth/me`, {
    headers: { accept: 'application/json', authorization: `Bearer ${token}` },
  })
  if (!response.ok) return null

  const body = (await response.json().catch(() => null)) as unknown
  if (typeof body !== 'object' || body === null) return null
  return 'user' in body && typeof body.user === 'object' && body.user !== null
    ? (body.user as AuthUser)
    : (body as AuthUser)
}

export async function loginWithApi(username: string, password: string) {
  const response = await fetch(`${apiUrl}/auth/local/login`, {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const body = (await response.json().catch(() => null)) as LoginResponse | null

  if (!response.ok) {
    return { error: body?.message ?? 'Không thể đăng nhập. Vui lòng thử lại.' }
  }
  if (!body?.jwt || !body.jwtRefresh) {
    return { error: 'Phản hồi đăng nhập không hợp lệ.' }
  }

  try {
    const user = (await getCurrentUser(body.jwt)) ?? body.user
    if (!user || !hasAdminAccess(user)) {
      return { error: 'Tài khoản của bạn không có quyền truy cập trang quản trị.' }
    }
    saveSession({ accessToken: body.jwt, refreshToken: body.jwtRefresh, user })
    return { error: null }
  } catch {
    return { error: 'Không thể xác minh tài khoản. Vui lòng thử lại.' }
  }
}
