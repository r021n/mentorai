import { createFileRoute } from '@tanstack/react-router'
import { TopicSelectPage } from '../../../pages/exercise/TopicSelect'
import { authPage } from '../../../lib/router/guards'

export const Route = createFileRoute('/_dashboard/exercise/')({
  beforeLoad: authPage('Katalog Topik Latihan'),
  component: TopicSelectPage,
})
