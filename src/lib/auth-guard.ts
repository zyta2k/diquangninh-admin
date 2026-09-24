export type AuthUser = {
  id?: string | number
  username?: string
  role?: string
  confirmed?: boolean
  blocked?: boolean
}

const ADMIN_ROLES = new Set(['ADMIN', 'SUPERADMIN'])

export function hasAdminAccess(user: AuthUser) {
  return typeof user.role === 'string' && ADMIN_ROLES.has(user.role)
}
