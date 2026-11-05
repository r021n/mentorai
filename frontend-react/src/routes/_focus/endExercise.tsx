import { createFileRoute, Navigate } from '@tanstack/react-router'
import { EndExercisePage } from '../../pages/exercise/EndExercise'
import { authPage } from '../../lib/router/guards'

interface EndExerciseSearch {
  topicId: number
}

export const Route = createFileRoute('/_focus/endExercise')({
  beforeLoad: authPage('Selesai Latihan'),
  validateSearch: (search: Record<string, unknown>): EndExerciseSearch => {
    const topicId = Number(search.topicId)
    return { topicId: Number.isFinite(topicId) && topicId > 0 ? topicId : 0 }
  },
  component: EndExerciseRoute,
})

function EndExerciseRoute() {
  const { topicId } = Route.useSearch()

  if (!topicId) {
    return <Navigate to="/exercise" replace />
  }

  return <EndExercisePage topicId={topicId} />
}
