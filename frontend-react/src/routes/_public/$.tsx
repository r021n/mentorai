import { createFileRoute } from '@tanstack/react-router'
import { NotFoundPage } from '../../pages/NotFound'

export const Route = createFileRoute('/_public/$')({
  component: NotFoundPage,
})
