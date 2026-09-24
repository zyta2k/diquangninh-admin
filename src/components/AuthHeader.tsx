import { Link } from '@tanstack/react-router'

export default function AuthHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link to="/auth/login" className="text-lg font-semibold tracking-tight">
          Đi Quảng Ninh
        </Link>
      </div>
    </header>
  )
}
