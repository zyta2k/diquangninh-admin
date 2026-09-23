import { Outlet, createFileRoute } from '@tanstack/react-router'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

export const Route = createFileRoute('/auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
