import { createFileRoute } from '@tanstack/react-router'
import { UsersManagerPage } from '../../../pages/admin/database/UsersManager'
import { adminPage } from '../../../lib/router/guards'

export const Route = createFileRoute('/_dashboard/database/users')({
  beforeLoad: adminPage('Database Pengguna'),
  component: UsersManagerPage,
})
