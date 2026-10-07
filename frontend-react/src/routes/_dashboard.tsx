import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DashboardLayout } from '../lib/components/layout/DashboardLayout'

export const Route = createFileRoute('/_dashboard')({
  component: DashboardShell,
})

function DashboardShell() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
