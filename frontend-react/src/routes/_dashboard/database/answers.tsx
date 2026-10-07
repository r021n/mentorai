import { createFileRoute } from '@tanstack/react-router'
import { AnswersManagerPage } from '../../../pages/admin/database/AnswersManager'
import { adminPage } from '../../../lib/router/guards'

export const Route = createFileRoute('/_dashboard/database/answers')({
  beforeLoad: adminPage('Database Jawaban AI'),
  component: AnswersManagerPage,
})
