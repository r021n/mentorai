import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, BookOpen, Search } from 'lucide-react'
import { exerciseApi } from '../../lib/api/exercise'
import { queryKeys } from '../../lib/query/query-keys'
import { toast } from '../../lib/stores/toast'
import type { ExerciseTopicStatus } from '../../lib/types/topic.types'
import { ExerciseTopicList } from '../../lib/components/exercise/ExerciseTopicList'
import { Button } from '../../lib/components/ui/Button'
import { cn } from '../../lib/utils/cn'

type TopicFilter = 'all' | Exclude<ExerciseTopicStatus, 'empty'>

const FILTERS: Array<{ value: TopicFilter; label: string }> = [
  { value: 'all', label: 'Semua' },
  { value: 'not_started', label: 'Belum dimulai' },
  { value: 'in_progress', label: 'Sedang berjalan' },
  { value: 'completed', label: 'Selesai' },
]

export function TopicSelectPage() {
  const { data: topics = [], isPending, isError, error, refetch } = useQuery({
    queryKey: queryKeys.exercise.topics(),
    queryFn: () => exerciseApi.getExerciseTopics(),
  })

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<TopicFilter>('all')

  useEffect(() => {
    if (isError) {
      toast.error((error as Error)?.message || 'Gagal memuat topik latihan.')
    }
  }, [isError, error])

  const completedCount = topics.filter((topic) => topic.status === 'completed').length
  const inProgressCount = topics.filter((topic) => topic.status === 'in_progress').length

  const filteredTopics = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return topics.filter((topic) => {
      const matchesSearch =
        normalizedSearch.length === 0 || topic.name.toLowerCase().includes(normalizedSearch)
      const matchesStatus = filter === 'all' || topic.status === filter
      return matchesSearch && matchesStatus
    })
  }, [topics, search, filter])

  const hasActiveFilter = search.trim().length > 0 || filter !== 'all'

  function resetFilters() {
    setSearch('')
    setFilter('all')
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl">
            Pilih Topik Latihan
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-neutral-600">
            Lanjutkan materi yang sedang berjalan atau mulai topik baru. Progres Anda tersimpan
            otomatis.
          </p>
        </div>

        {topics.length > 0 ? (
          <p className="text-xs font-medium text-neutral-600">
            <span className="font-semibold text-neutral-950">{topics.length}</span> topik
            {completedCount > 0 ? ` · ${completedCount} selesai` : null}
            {inProgressCount > 0 ? ` · ${inProgressCount} berjalan` : null}
          </p>
        ) : null}
      </header>

      {isPending ? (
        <TopicListSkeleton />
      ) : isError ? (
        <div className="space-y-3 rounded-2xl border border-neutral-300 bg-white p-6 text-center">
          <AlertCircle size={28} className="mx-auto text-neutral-900" />
          <p className="text-sm font-semibold text-neutral-900">
            {(error as Error)?.message || 'Gagal memuat topik latihan.'}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Muat Ulang
          </Button>
        </div>
      ) : topics.length === 0 ? (
        <div className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-10 text-center">
          <BookOpen size={32} className="mx-auto text-neutral-400" />
          <h2 className="text-base font-semibold text-neutral-900">Belum Ada Topik Tersedia</h2>
          <p className="mx-auto max-w-sm text-sm text-neutral-600">
            Administrator belum menambahkan materi atau topik latihan. Silakan cek kembali beberapa
            saat lagi.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-xs">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari topik..."
                aria-label="Cari topik latihan"
                className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((item) => {
                const isActive = filter === item.value
                return (
                  <button
                    key={item.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setFilter(item.value)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
                    )}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="space-y-3 rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
              <Search size={28} className="mx-auto text-neutral-400" />
              <h2 className="text-base font-semibold text-neutral-900">
                Tidak ada topik yang cocok
              </h2>
              <p className="mx-auto max-w-sm text-sm text-neutral-600">
                Coba kata kunci lain atau tampilkan semua topik.
              </p>
              {hasActiveFilter ? (
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset Filter
                </Button>
              ) : null}
            </div>
          ) : (
            <ExerciseTopicList topics={filteredTopics} />
          )}
        </>
      )}
    </div>
  )
}

function TopicListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="divide-y divide-neutral-200">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="flex items-center gap-4 px-5 py-5">
            <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />
            <div className="h-2 w-28 animate-pulse rounded-full bg-neutral-100" />
            <div className="ml-auto h-8 w-24 animate-pulse rounded-lg bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  )
}
