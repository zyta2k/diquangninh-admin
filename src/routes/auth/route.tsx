import { Outlet, createFileRoute } from '@tanstack/react-router'
import AuthHeader from '../../components/AuthHeader'
import Footer from '../../components/Footer'

export const Route = createFileRoute('/auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
