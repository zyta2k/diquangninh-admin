import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import { authClient } from '../../lib/auth-client'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  const navigate = useNavigate()
  const { data: session, isPending, error } = authClient.useSession()

  useEffect(() => {
    if (!isPending && !error && !session) {
      void navigate({ to: '/auth/login', replace: true })
    }
  }, [error, isPending, navigate, session])

  if (isPending) {
    return (
      <main className="grid min-h-screen place-items-center p-6 text-sm text-muted-foreground">
        Đang kiểm tra phiên đăng nhập...
      </main>
    )
  }

  if (!session && !error) {
    return null
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md space-y-3 text-center">
          <h1 className="text-lg font-semibold">Không thể xác minh phiên đăng nhập</h1>
          <p className="text-sm text-muted-foreground">
            Dịch vụ xác thực hiện không khả dụng. Vui lòng thử đăng nhập lại.
          </p>
          <Link
            to="/auth/login"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            Đi đến trang đăng nhập
          </Link>
        </div>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
