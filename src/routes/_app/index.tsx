import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({ component: App })

function App() {
  return <section className="space-y-3">Hello World</section>
}
