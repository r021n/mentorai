import { createFileRoute } from '@tanstack/react-router'
import { RegisterPage } from '../../pages/Register'
import { guardRoute } from '../../lib/router/guards'

export const Route = createFileRoute('/_public/register')({
  beforeLoad: () => guardRoute('guest-only'),
  component: RegisterPage,
})
