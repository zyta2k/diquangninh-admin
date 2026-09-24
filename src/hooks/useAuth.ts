import { useState } from 'react'
import { authClient } from '../lib/auth-client'
import type { FormEvent } from 'react'

type LoginCredentials = {
  username: string
  password: string
}

type LoginResponse = {
  message?: string
}

export function useAuth() {
  const {
    data: session,
    isPending,
    error: sessionError,
  } = authClient.useSession()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  async function login({ username, password }: LoginCredentials) {
    setIsLoggingIn(true)

    try {
      const response = await fetch('/api/auth/sign-in/local', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password }),
      })
      const result = (await response
        .json()
        .catch(() => null)) as LoginResponse | null

      return {
        error: response.ok
          ? null
          : (result?.message ?? 'Không thể đăng nhập. Vui lòng thử lại.'),
      }
    } catch {
      return {
        error: 'Không thể kết nối đến dịch vụ đăng nhập. Vui lòng thử lại.',
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  async function logout() {
    setIsLoggingOut(true)

    try {
      const { error } = await authClient.signOut()
      return { error: error?.message ?? null }
    } catch {
      return { error: 'Không thể đăng xuất. Vui lòng thử lại.' }
    } finally {
      setIsLoggingOut(false)
    }
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') ?? '')
    const password = String(formData.get('password') ?? '')

    setLoginError(null)
    const result = await login({ username, password })

    if (result.error) {
      setLoginError(result.error)
      return
    }

    // Reload so Better Auth's session hook reads the newly set HTTP-only cookies.
    window.location.assign('/')
  }

  return {
    error: sessionError,
    isLoggingIn,
    isLoggingOut,
    isPending,
    handleLoginSubmit,
    login,
    loginError,
    logout,
    session,
    user: session?.user ?? null,
  }
}
