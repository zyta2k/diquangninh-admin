import { createAuthClient } from 'better-auth/react'

/**
 * The Better Auth server is expected at `/api/auth` on this application host.
 * Set VITE_AUTH_BASE_URL only when the API is hosted on a different origin.
 */
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL,
})
