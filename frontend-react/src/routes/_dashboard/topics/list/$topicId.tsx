import { createFileRoute } from '@tanstack/react-router'
import { QuestionListPage } from '../../../../pages/admin/QuestionList'
import { adminPage } from '../../../../lib/router/guards'

export const Route = createFileRoute('/_dashboard/topics/list/$topicId')({
  beforeLoad: adminPage('Kelola Butir Soal'),
  component: QuestionListRoute,
})

function QuestionListRoute() {
  const { topicId } = Route.useParams()
  return <QuestionListPage topicId={topicId} />
}
