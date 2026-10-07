import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '../../pages/Login'
import { guardRoute } from '../../lib/router/guards'

export const Route = createFileRoute('/_public/login')({
  beforeLoad: () => guardRoute('guest-only'),
  component: LoginPage,
})
