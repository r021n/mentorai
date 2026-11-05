import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { exerciseApi } from '../api/exercise'
import { queryKeys } from '../query/query-keys'
import { useExerciseStore } from '../stores/exercise'
import { toast } from '../stores/toast'

export function useExerciseSession(topicId: number) {
  const query = useQuery({
    queryKey: queryKeys.exercise.data(topicId),
    queryFn: () => exerciseApi.getExerciseData(topicId),
  })

  const hydratedTopicRef = useRef<number | null>(null)

  useEffect(() => {
    if (!query.data || hydratedTopicRef.current === query.data.topic.id) return
    hydratedTopicRef.current = query.data.topic.id
    useExerciseStore.getState().loadData(query.data.topic, query.data.questions, query.data.answers)
  }, [query.data])

  useEffect(() => {
    if (query.isError) {
      toast.error((query.error as Error)?.message || 'Gagal memuat latihan soal.')
    }
  }, [query.isError, query.error])

  return query
}
