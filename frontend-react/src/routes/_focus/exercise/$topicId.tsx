import { createFileRoute } from '@tanstack/react-router'
import { ExerciseRunnerPage } from '../../../pages/exercise/ExerciseRunner'
import { authPage } from '../../../lib/router/guards'

export const Route = createFileRoute('/_focus/exercise/$topicId')({
  beforeLoad: authPage('Pengerjaan Latihan Soal'),
  component: ExerciseRunnerRoute,
})

function ExerciseRunnerRoute() {
  const { topicId } = Route.useParams()
  return <ExerciseRunnerPage topicId={topicId} />
}
