import { createFileRoute } from '@tanstack/react-router'
import { FaqPage } from '../../pages/Faq'

export const Route = createFileRoute('/_public/faq')({
  component: FaqPage,
})
