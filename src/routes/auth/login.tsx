import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../../hooks/useAuth'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const { handleLoginSubmit, isLoggingIn, loginError } = useAuth()

  return (
    <section className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Đăng nhập để tiếp tục vào trang quản trị.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleLoginSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="username">
            Tên đăng nhập
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {loginError ? (
          <p
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {loginError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoggingIn}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </section>
  )
}
