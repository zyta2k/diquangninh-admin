import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const navigate = useNavigate()
  const { isLoggingOut, logout, user } = useAuth()

  async function handleSignOut() {
    logout()
    await navigate({ to: '/auth/login' })
  }

  return (
    <header className="border-b bg-background">
      <div className="flex h-16  items-center px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Đi Quảng Ninh
        </Link>
        <div className="ml-auto flex items-center gap-3">
          {user?.username ? (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.username}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </button>
        </div>
      </div>
    </header>
  )
}
