import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Footer } from '../lib/components/Footer'
import { Navbar } from '../lib/components/Navbar'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
