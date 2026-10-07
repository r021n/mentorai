import { createFileRoute } from '@tanstack/react-router'
import { EndExercisePage } from '../../pages/exercise/EndExercise'
import { authPage } from '../../lib/router/guards'

export const Route = createFileRoute('/_dashboard/endExercise')({
  beforeLoad: authPage('Selesai Latihan'),
  component: EndExercisePage,
})
