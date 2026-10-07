import { createFileRoute } from '@tanstack/react-router'
import { TopicListPage } from '../../../pages/admin/TopicList'
import { adminPage } from '../../../lib/router/guards'

export const Route = createFileRoute('/_dashboard/topics/')({
  beforeLoad: adminPage('Kelola Topik Pembelajaran'),
  component: TopicListPage,
})
