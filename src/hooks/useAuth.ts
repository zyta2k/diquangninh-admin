import { useEffect, useState } from 'react'
import { clearSession, getCurrentUser, getStoredSession, loginWithApi } from '../lib/auth'
import type { FormEvent } from 'react'

export function useAuth() {
  const [session, setSession] = useState(getStoredSession)
  const [isPending, setIsPending] = useState(true)
  const [sessionError, setSessionError] = useState<Error | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    const storedSession = getStoredSession()
    if (!storedSession) {
      setIsPending(false)
      return
    }

    void getCurrentUser(storedSession.accessToken)
      .then((user) => {
        if (!user) {
          clearSession()
          setSession(null)
          return
        }
        setSession({ ...storedSession, user })
      })
      .catch(() => setSessionError(new Error('Không thể xác minh phiên đăng nhập.')))
      .finally(() => setIsPending(false))
  }, [])

  async function login(username: string, password: string) {
    setIsLoggingIn(true)

    try {
      return await loginWithApi(username, password)
    } catch {
      return {
        error: 'Không thể kết nối đến dịch vụ đăng nhập. Vui lòng thử lại.',
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  function logout() {
    setIsLoggingOut(true)

    clearSession()
    setSession(null)
    setIsLoggingOut(false)
    return { error: null }
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') ?? '')
    const password = String(formData.get('password') ?? '')

    setLoginError(null)
    const result = await login(username, password)

    if (result.error) {
      setLoginError(result.error)
      return
    }

    // Re-read the client-side session after the direct API login succeeds.
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
