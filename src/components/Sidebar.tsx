import { Link } from '@tanstack/react-router'
import { LayoutDashboard } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="w-16 shrink-0 border-r bg-muted/20 sm:w-56">
      <nav className="space-y-1 p-2" aria-label="Main navigation">
        <Link
          to="/"
          activeProps={{ className: 'bg-accent text-accent-foreground' }}
          className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LayoutDashboard className="size-5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
      </nav>
    </aside>
  )
}
