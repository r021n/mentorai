import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '../../pages/Dashboard'
import { authPage } from '../../lib/router/guards'

export const Route = createFileRoute('/_dashboard/dashboard')({
  beforeLoad: authPage('Dashboard'),
  component: DashboardPage,
})
