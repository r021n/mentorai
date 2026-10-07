import { createFileRoute } from '@tanstack/react-router'
import { MyAnswersPage } from '../../../pages/my-answers/MyAnswers'
import { authPage } from '../../../lib/router/guards'

export const Route = createFileRoute('/_dashboard/myAnswers/$topicId')({
  beforeLoad: authPage('Hasil Evaluasi Jawaban'),
  component: MyAnswersRoute,
})

function MyAnswersRoute() {
  const { topicId } = Route.useParams()
  return <MyAnswersPage topicId={topicId} />
}
