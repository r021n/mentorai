import { createFileRoute, Outlet } from '@tanstack/react-router'
import { FocusLayout } from '../lib/components/layout/FocusLayout'
import { guardRoute } from '../lib/router/guards'

export const Route = createFileRoute('/_focus')({
  beforeLoad: () => {
    guardRoute('auth')
  },
  component: FocusShell,
})

function FocusShell() {
  return (
    <FocusLayout>
      <Outlet />
    </FocusLayout>
  )
}
