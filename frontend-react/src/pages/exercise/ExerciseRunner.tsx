import { useCallback, useRef, useState } from 'react'
import { Link, useBlocker, useNavigate } from '@tanstack/react-router'
import { AlertCircle, ChevronRight, Send } from 'lucide-react'
import { exerciseApi } from '../../lib/api/exercise'
import { queryClient } from '../../lib/query/query-client'
import { queryKeys } from '../../lib/query/query-keys'
import { useAnswerDraft } from '../../lib/hooks/useAnswerDraft'
import { useExerciseSession } from '../../lib/hooks/useExerciseSession'
import { useAuthStore } from '../../lib/stores/auth'
import {
  selectAnsweredCount,
  selectAnsweredPercent,
  selectCurrentAnswerRecord,
  selectCurrentQuestion,
  selectIsFirstQuestion,
  selectIsLastQuestion,
  selectUnansweredCount,
  useExerciseStore,
} from '../../lib/stores/exercise'
import { toast } from '../../lib/stores/toast'
import { countWords, isValidAnswer } from '../../lib/utils/validation'
import { FeedbackPanel } from '../../lib/components/exercise/FeedbackPanel'
import type { FeedbackState } from '../../lib/components/exercise/FeedbackPanel'
import { FocusHeader } from '../../lib/components/exercise/FocusHeader'
import { QuestionNavigator } from '../../lib/components/exercise/QuestionNavigator'
import { QuestionPanel } from '../../lib/components/exercise/QuestionPanel'
import { AnswerForm } from '../../lib/components/exercise/AnswerForm'
import { StickyActionBar } from '../../lib/components/exercise/StickyActionBar'
import { Button } from '../../lib/components/ui/Button'
import { buttonClassName } from '../../lib/components/ui/button-styles'
import { ConfirmDialog } from '../../lib/components/ui/ConfirmDialog'
import { Spinner } from '../../lib/components/ui/Spinner'

export interface ExerciseRunnerPageProps {
  topicId: string
}

export function ExerciseRunnerPage({ topicId }: ExerciseRunnerPageProps) {
  const numericTopicId = Number(topicId)
  const navigate = useNavigate()

  const { data, isPending, isError, error, refetch } = useExerciseSession(numericTopicId)

  const user = useAuthStore((state) => state.user)

  const activeQuestion = useExerciseStore(selectCurrentQuestion)
  const activeAnswer = useExerciseStore(selectCurrentAnswerRecord)
  const storeTopicId = useExerciseStore((state) => state.topicId)
  const currentIndex = useExerciseStore((state) => state.currentIndex)
  const questions = useExerciseStore((state) => state.questions)
  const answersMap = useExerciseStore((state) => state.answersMap)
  const topicName = useExerciseStore((state) => state.topicName)
  const isSubmitting = useExerciseStore((state) => state.isSubmitting)
  const isGeneratingFeedback = useExerciseStore((state) => state.isGeneratingFeedback)
  const loadingText = useExerciseStore((state) => state.loadingText)
  const answeredCount = useExerciseStore(selectAnsweredCount)
  const unansweredCount = useExerciseStore(selectUnansweredCount)
  const answeredPercent = useExerciseStore(selectAnsweredPercent)
  const isFirstQuestion = useExerciseStore(selectIsFirstQuestion)
  const isLastQuestion = useExerciseStore(selectIsLastQuestion)

  const savedAnswer = activeAnswer?.answer ?? ''
  const { draft, setDraft, clearDraft, isDirty } = useAnswerDraft({
    userId: user?.id,
    topicId: numericTopicId,
    questionId: activeQuestion?.id ?? 0,
    savedAnswer,
  })

  const [feedbackQuestionId, setFeedbackQuestionId] = useState<number | null>(null)
  const [feedbackErrorQuestionId, setFeedbackErrorQuestionId] = useState<number | null>(null)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false)
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false)
  const allowNavigationRef = useRef(false)

  const isAnswerSaved = Boolean(activeAnswer?.answer)
  const hasFeedback = Boolean(activeAnswer?.feedback)
  const wordCount = countWords(draft)
  const canSubmit = isValidAnswer(draft) && !isSubmitting && !isAnswerSaved
  const hasStarted = answeredCount > 0 || isDirty
  const isSessionDirty = isDirty || (hasStarted && unansweredCount > 0)
  const isReadyForTopic = storeTopicId === numericTopicId && activeQuestion !== null

  const isGeneratingForCurrentQuestion =
    isGeneratingFeedback && feedbackQuestionId === (activeQuestion?.id ?? null)
  const hasFeedbackErrorForCurrentQuestion =
    feedbackErrorQuestionId === (activeQuestion?.id ?? null)

  const feedbackState: FeedbackState =
    isSubmitting || isGeneratingForCurrentQuestion
      ? 'loading'
      : hasFeedbackErrorForCurrentQuestion
        ? 'error'
        : hasFeedback
          ? 'ready'
          : 'idle'

  const feedbackLoadingText =
    loadingText || (isSubmitting ? 'Menyimpan jawaban...' : 'Menganalisis jawaban Anda...')

  const unansweredNumbers = questions
    .map((question, index) => (!answersMap[question.id]?.answer ? index + 1 : null))
    .filter((value): value is number => value !== null)

  const shouldBlockNavigation = useCallback(
    () => !allowNavigationRef.current && isSessionDirty,
    [isSessionDirty],
  )

  const blocker = useBlocker({
    shouldBlockFn: shouldBlockNavigation,
    enableBeforeUnload: isSessionDirty,
    disabled: !isSessionDirty,
    withResolver: true,
  })

  const isExitDialogVisible = isExitDialogOpen || blocker.status === 'blocked'

  function invalidateProgress() {
    void queryClient.invalidateQueries({ queryKey: queryKeys.exercise.topics() })
    void queryClient.invalidateQueries({ queryKey: queryKeys.myAnswers.byTopic(numericTopicId) })
  }

  async function triggerAiFeedback() {
    if (!activeQuestion) return

    const questionId = activeQuestion.id
    const store = useExerciseStore.getState()
    setFeedbackQuestionId(questionId)
    setFeedbackErrorQuestionId(null)
    store.setGeneratingFeedback(true)
    store.setLoadingText('Menganalisis jawaban Anda...')

    try {
      const evaluation = await exerciseApi.requestFeedback(numericTopicId, questionId)
      store.saveAnswerRecord(questionId, {
        score: evaluation.score,
        feedback: evaluation.feedback,
      })
      invalidateProgress()
      toast.success('Evaluasi AI berhasil diterima.')
    } catch (err) {
      setFeedbackErrorQuestionId(questionId)
      toast.error((err as Error)?.message || 'Gagal menghubungi AI. Silakan coba lagi nanti.')
    } finally {
      setFeedbackQuestionId(null)
      store.setGeneratingFeedback(false)
      store.setLoadingText('')
    }
  }

  async function submitAnswer() {
    if (!activeQuestion || !canSubmit) return

    const questionId = activeQuestion.id
    const answerText = draft.trim()
    const store = useExerciseStore.getState()
    store.setSubmitting(true)
    store.setLoadingText('Menyimpan jawaban...')
    setFeedbackErrorQuestionId(null)

    try {
      await exerciseApi.submitAnswer(numericTopicId, questionId, answerText)
      store.saveAnswerRecord(questionId, {
        answer: answerText,
        score: 0,
        feedback: null,
      })
      clearDraft()
      invalidateProgress()
      await triggerAiFeedback()
    } catch (err) {
      toast.error((err as Error)?.message || 'Gagal mengirim jawaban.')
    } finally {
      store.setSubmitting(false)
    }
  }

  function requestSubmit() {
    if (!canSubmit) return
    setIsSubmitDialogOpen(true)
  }

  function confirmSubmit() {
    setIsSubmitDialogOpen(false)
    void submitAnswer()
  }

  function goNext() {
    if (isLastQuestion) {
      requestFinish()
      return
    }
    useExerciseStore.getState().next()
  }

  function goPrev() {
    useExerciseStore.getState().prev()
  }

  function requestFinish() {
    if (unansweredCount > 0) {
      setIsFinishDialogOpen(true)
      return
    }
    finishSession()
  }

  function finishSession() {
    setIsFinishDialogOpen(false)
    allowNavigationRef.current = true
    navigate({ to: '/endExercise', search: { topicId: numericTopicId } })
  }

  function requestExit() {
    if (!isSessionDirty) {
      navigate({ to: '/exercise' })
      return
    }
    setIsExitDialogOpen(true)
  }

  function confirmExit() {
    setIsExitDialogOpen(false)
    allowNavigationRef.current = true

    if (blocker.status === 'blocked') {
      blocker.proceed?.()
      return
    }

    navigate({ to: '/exercise' })
  }

  function cancelExit() {
    setIsExitDialogOpen(false)
    allowNavigationRef.current = false
    if (blocker.status === 'blocked') {
      blocker.reset?.()
    }
  }

  const primaryLabel = !isAnswerSaved
    ? 'Kirim Jawaban'
    : isLastQuestion
      ? 'Selesai Latihan'
      : 'Selanjutnya'
  const primaryIcon = !isAnswerSaved ? <Send size={15} /> : <ChevronRight size={15} />
  const primaryAction = !isAnswerSaved ? requestSubmit : goNext
  const primaryDisabled = !isAnswerSaved && !canSubmit

  const footerHint = isSubmitting
    ? loadingText || 'Menyimpan jawaban...'
    : isGeneratingForCurrentQuestion
      ? loadingText || 'Menganalisis jawaban Anda...'
      : !isAnswerSaved
        ? `${wordCount} kata · minimal 2 kata`
        : unansweredCount > 0
          ? `${unansweredCount} soal belum dijawab`
          : 'Semua soal sudah dijawab'

  return (
    <>
      <FocusHeader
        topicName={isReadyForTopic ? topicName : 'Latihan Soal'}
        questionLabel={
          isReadyForTopic ? `Soal ${currentIndex + 1} dari ${questions.length}` : undefined
        }
        answeredLabel={
          isReadyForTopic ? `${answeredCount}/${questions.length} dijawab` : undefined
        }
        progressPercent={isReadyForTopic ? answeredPercent : undefined}
        onExit={requestExit}
        onOpenNavigator={isReadyForTopic ? () => setIsNavigatorOpen(true) : undefined}
      />

      <main className="flex-1 px-4 py-6 pb-32 sm:px-6 lg:px-8">
        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Spinner size="lg" />
            <p className="text-xs text-neutral-600">Menyiapkan materi latihan...</p>
          </div>
        ) : isError ? (
          <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-neutral-300 bg-white p-8 text-center">
            <AlertCircle size={32} className="mx-auto text-neutral-900" />
            <h1 className="text-base font-bold text-neutral-900">
              {(error as Error)?.message || 'Gagal memuat latihan soal.'}
            </h1>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/exercise" className={buttonClassName({ variant: 'outline', size: 'sm' })}>
                Kembali ke Katalog
              </Link>
              <Button size="sm" onClick={() => refetch()}>
                Coba Lagi
              </Button>
            </div>
          </div>
        ) : data && data.questions.length === 0 ? (
          <div className="mx-auto max-w-xl space-y-3 rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-neutral-900">Belum ada soal pada topik ini.</p>
            <Link to="/exercise" className={buttonClassName({ size: 'sm' })}>
              Kembali ke Katalog
            </Link>
          </div>
        ) : !isReadyForTopic ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : activeQuestion ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div className="space-y-5">
              <QuestionPanel question={activeQuestion} isAnswered={isAnswerSaved} />
              <AnswerForm
                value={draft}
                onChange={setDraft}
                wordCount={wordCount}
                isSaved={isAnswerSaved}
                isSubmitting={isSubmitting}
              />
            </div>

            <div className="lg:sticky lg:top-24">
              <FeedbackPanel
                state={feedbackState}
                feedback={activeAnswer?.feedback ?? null}
                score={activeAnswer?.score ?? null}
                loadingText={feedbackLoadingText}
                isLastQuestion={isLastQuestion}
                onRetry={() => void triggerAiFeedback()}
                onNext={goNext}
              />
            </div>
          </div>
        ) : null}
      </main>

      {isReadyForTopic && activeQuestion ? (
        <StickyActionBar
          showPrev={!isFirstQuestion}
          onPrev={goPrev}
          primaryLabel={primaryLabel}
          primaryIcon={primaryIcon}
          onPrimary={primaryAction}
          primaryDisabled={primaryDisabled}
          hint={footerHint}
        />
      ) : null}

      <ConfirmDialog
        isOpen={isSubmitDialogOpen}
        title="Kirim jawaban ini?"
        description="Jawaban yang sudah dikirim tidak dapat diubah. Pastikan Anda sudah menulis dengan lengkap."
        confirmLabel="Kirim & Nilai"
        onConfirm={confirmSubmit}
        onCancel={() => setIsSubmitDialogOpen(false)}
      >
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
          <span className="font-semibold text-neutral-900">{wordCount} kata</span> akan dikirim
          untuk dievaluasi AI.
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        isOpen={isFinishDialogOpen}
        title="Selesaikan latihan?"
        description={`Masih ada ${unansweredCount} soal yang belum dijawab. Anda tetap bisa meninjaunya nanti.`}
        confirmLabel="Tetap Selesaikan"
        onConfirm={finishSession}
        onCancel={() => setIsFinishDialogOpen(false)}
      >
        <div className="flex flex-wrap gap-1.5">
          {unansweredNumbers.map((number) => (
            <span
              key={number}
              className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-neutral-300 bg-white px-2 text-xs font-semibold text-neutral-700"
            >
              {number}
            </span>
          ))}
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        isOpen={isExitDialogVisible}
        title="Keluar dari latihan?"
        description={
          isDirty
            ? 'Draft jawaban saat ini belum dikirim. Draft tersimpan di perangkat ini, tetapi progres sesi akan dihentikan.'
            : `${unansweredCount} soal belum dijawab. Jawaban yang sudah dikirim tetap tersimpan.`
        }
        confirmLabel="Keluar"
        cancelLabel="Lanjutkan"
        tone="danger"
        onConfirm={confirmExit}
        onCancel={cancelExit}
      />

      <QuestionNavigator
        isOpen={isNavigatorOpen}
        questions={questions}
        answersMap={answersMap}
        currentIndex={currentIndex}
        onSelect={(index) => useExerciseStore.getState().goTo(index)}
        onClose={() => setIsNavigatorOpen(false)}
      />
    </>
  )
}
