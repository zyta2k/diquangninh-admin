import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { hasAdminAccess } from '../../../lib/auth-guard'
import type { AuthUser } from '../../../lib/auth-guard'

const ACCESS_TOKEN_COOKIE = 'diquangninh-access-token'
const REFRESH_TOKEN_COOKIE = 'diquangninh-refresh-token'
const ONE_WEEK = 60 * 60 * 24 * 7

type LoginResponse = {
  jwt?: string
  jwtRefresh?: string
  user?: AuthUser
}

type ApiErrorResponse = {
  message?: string
  statusCode?: number
}

type SuccessfulLoginResponse = {
  jwt: string
  jwtRefresh: string
  user: AuthUser
}

type LoginResult =
  | { data: SuccessfulLoginResponse }
  | { error: string; status: number }

type JwtClaims = {
  id?: string
  username?: string
  role?: string
  confirmed?: boolean
  blocked?: boolean
  exp?: number
}

function json(body: unknown, init?: ResponseInit) {
  return Response.json(body, init)
}

function apiUrl() {
  const baseUrl = env.API_URL
  if (!baseUrl) throw new Error('API_URL is not configured')
  return baseUrl.replace(/\/$/, '')
}

function readCookie(request: Request, name: string) {
  return request.headers
    .get('cookie')
    ?.split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1)
}

function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    return JSON.parse(atob(padded)) as JwtClaims
  } catch {
    return null
  }
}

function isExpired(claims: JwtClaims) {
  return typeof claims.exp === 'number' && claims.exp * 1000 <= Date.now()
}

function cookie(
  name: string,
  value: string,
  request: Request,
  maxAge = ONE_WEEK,
) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`
}

function cookieHeaders(values: Array<string>) {
  const headers = new Headers()
  for (const value of values) headers.append('Set-Cookie', value)
  return headers
}

function sessionFromToken(token: string, user: AuthUser) {
  const claims = decodeJwt(token)
  if (!claims || isExpired(claims) || !claims.id || !claims.username)
    return null

  return {
    session: {
      id: claims.id,
      // Do not expose the API access token to client-side JavaScript.
      token: claims.id,
      userId: claims.id,
      expiresAt: new Date(
        (claims.exp ?? Date.now() / 1000 + ONE_WEEK) * 1000,
      ).toISOString(),
    },
    user: {
      id: String(user.id ?? claims.id),
      name: user.username ?? claims.username,
      email: user.username ?? claims.username,
      role: user.role ?? claims.role,
      confirmed: user.confirmed ?? claims.confirmed,
      blocked: user.blocked ?? claims.blocked,
    },
  }
}

function isAuthUser(value: unknown): value is AuthUser {
  return typeof value === 'object' && value !== null
}

async function getCurrentUser(token: string): Promise<AuthUser | null> {
  try {
    const response = await fetch(`${apiUrl()}/auth/me`, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) return null

    const body = (await response.json().catch(() => null)) as unknown
    if (!isAuthUser(body)) return null

    return 'user' in body && isAuthUser(body.user) ? body.user : body
  } catch {
    return null
  }
}

async function login(username: string, password: string): Promise<LoginResult> {
  const response = await fetch(`${apiUrl()}/auth/local/login`, {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const body = (await response.json().catch(() => null)) as
    | LoginResponse
    | ApiErrorResponse
    | null

  if (!response.ok) {
    return {
      error:
        body && 'message' in body && typeof body.message === 'string'
          ? body.message
          : 'Không thể đăng nhập. Vui lòng thử lại.',
      status: response.status,
    }
  }
  if (
    !body ||
    !('jwt' in body) ||
    !body.jwt ||
    !body.jwtRefresh ||
    !body.user
  ) {
    return {
      error: 'Phản hồi đăng nhập không hợp lệ.',
      status: 502,
    }
  }

  return { data: body as SuccessfulLoginResponse }
}

/**
 * Proxies the external API login and keeps its tokens in HTTP-only cookies.
 * The session and sign-out endpoints retain the interface used by the client.
 */
export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        if (params._splat !== 'get-session')
          return json({ message: 'Not found' }, { status: 404 })

        const token = readCookie(request, ACCESS_TOKEN_COOKIE)
        if (!token) return json(null)

        const user = await getCurrentUser(token)
        if (!user || !hasAdminAccess(user)) {
          return json(null, {
            headers: cookieHeaders([
              cookie(ACCESS_TOKEN_COOKIE, '', request, 0),
              cookie(REFRESH_TOKEN_COOKIE, '', request, 0),
            ]),
          })
        }

        return json(sessionFromToken(token, user))
      },
      POST: async ({ request, params }) => {
        if (params._splat === 'sign-in/local') {
          const body = (await request.json()) as {
            username?: string
            password?: string
          }
          const result = await login(body.username ?? '', body.password ?? '')

          if ('error' in result) {
            return json(
              { code: 'INVALID_CREDENTIALS', message: result.error },
              { status: result.status },
            )
          }

          const { jwt, jwtRefresh } = result.data
          const user = await getCurrentUser(jwt)
          if (user && !hasAdminAccess(user)) {
            return json(
              {
                code: 'FORBIDDEN',
                message:
                  'Tài khoản của bạn không có quyền truy cập trang quản trị.',
              },
              {
                status: 403,
                headers: cookieHeaders([
                  cookie(ACCESS_TOKEN_COOKIE, '', request, 0),
                  cookie(REFRESH_TOKEN_COOKIE, '', request, 0),
                ]),
              },
            )
          }

          const session = user ? sessionFromToken(jwt, user) : null
          if (!session) {
            return json(
              {
                code: 'INVALID_RESPONSE',
                message: 'Token đăng nhập không hợp lệ.',
              },
              { status: 502 },
            )
          }

          return json(session, {
            headers: cookieHeaders([
              cookie(ACCESS_TOKEN_COOKIE, jwt, request),
              cookie(REFRESH_TOKEN_COOKIE, jwtRefresh, request),
            ]),
          })
        }

        if (params._splat === 'sign-out') {
          return json(
            { success: true },
            {
              headers: cookieHeaders([
                cookie(ACCESS_TOKEN_COOKIE, '', request, 0),
                cookie(REFRESH_TOKEN_COOKIE, '', request, 0),
              ]),
            },
          )
        }

        return json({ message: 'Not found' }, { status: 404 })
      },
    },
  },
})
