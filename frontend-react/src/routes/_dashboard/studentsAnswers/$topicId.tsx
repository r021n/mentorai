import { createFileRoute } from '@tanstack/react-router'
import { StudentAnswersPage } from '../../../pages/admin/StudentAnswers'
import { adminPage } from '../../../lib/router/guards'

export const Route = createFileRoute('/_dashboard/studentsAnswers/$topicId')({
  beforeLoad: adminPage('Matriks Jawaban Siswa'),
  component: StudentAnswersRoute,
})

function StudentAnswersRoute() {
  const { topicId } = Route.useParams()
  return <StudentAnswersPage topicId={topicId} />
}
