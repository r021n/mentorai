import { useEffect, useRef, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react'
import { exerciseApi } from '../../lib/api/exercise'
import { queryKeys } from '../../lib/query/query-keys'
import {
  selectCurrentAnswerRecord,
  selectCurrentQuestion,
  selectIsFirstQuestion,
  selectIsLastQuestion,
  selectProgressPercent,
  useExerciseStore,
} from '../../lib/stores/exercise'
import { toast } from '../../lib/stores/toast'
import { countWords, isValidAnswer } from '../../lib/utils/validation'
import { animateFeedback } from '../../lib/utils/typewriter'
import { cn } from '../../lib/utils/cn'
import { AntiCheatContainer } from '../../lib/components/AntiCheatContainer'
import { Badge } from '../../lib/components/ui/Badge'
import { Button } from '../../lib/components/ui/Button'
import { ProgressBar } from '../../lib/components/ui/ProgressBar'
import { Spinner } from '../../lib/components/ui/Spinner'

export interface ExerciseRunnerPageProps {
  topicId: string
}

export function ExerciseRunnerPage({ topicId }: ExerciseRunnerPageProps) {
  const numericTopicId = Number(topicId)

  const [draftAnswer, setDraftAnswer] = useState('')
  const [typewriterText, setTypewriterText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [retryAiError, setRetryAiError] = useState(false)
  const stopRef = useRef<(() => void) | null>(null)
  const hydratedTopicRef = useRef<number | null>(null)

  const navigate = useNavigate()

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: queryKeys.exercise.data(numericTopicId),
    queryFn: () => exerciseApi.getExerciseData(numericTopicId),
  })

  useEffect(() => {
    if (!data || hydratedTopicRef.current === data.topic.id) return
    hydratedTopicRef.current = data.topic.id
    useExerciseStore.getState().loadData(data.topic, data.questions, data.answers)
  }, [data])

  useEffect(() => {
    if (isError) {
      toast.error((error as Error)?.message || 'Gagal memuat latihan soal.')
    }
  }, [isError, error])

  const activeQuestion = useExerciseStore(selectCurrentQuestion)
  const progressPercent = useExerciseStore(selectProgressPercent)
  const isFirstQuestion = useExerciseStore(selectIsFirstQuestion)
  const isLastQuestion = useExerciseStore(selectIsLastQuestion)
  const activeAnswer = useExerciseStore(selectCurrentAnswerRecord)
  const isSubmitting = useExerciseStore((state) => state.isSubmitting)
  const isGeneratingFeedback = useExerciseStore((state) => state.isGeneratingFeedback)
  const loadingText = useExerciseStore((state) => state.loadingText)
  const questions = useExerciseStore((state) => state.questions)
  const currentIndex = useExerciseStore((state) => state.currentIndex)
  const topicName = useExerciseStore((state) => state.topicName)

  const isAnswerSaved = !!activeAnswer?.answer
  const hasFeedback = !!activeAnswer?.feedback
  const wordCount = countWords(draftAnswer)
  const canSubmit = isValidAnswer(draftAnswer) && !isSubmitting && !isAnswerSaved

  const currentQuestionId = activeQuestion?.id

  useEffect(() => {
    const stop = stopRef.current
    if (stop) {
      stop()
      stopRef.current = null
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRetryAiError(false)

    const answer = useExerciseStore.getState().answersMap[currentQuestionId ?? -1]
    if (answer?.answer) {
      setDraftAnswer(answer.answer)
      if (answer.feedback) {
        const animatedKey = `feedbackAnimated_${currentQuestionId}`
        if (sessionStorage.getItem(animatedKey)) {
          setTypewriterText(answer.feedback)
          setIsTyping(false)
        } else {
          setTypewriterText('')
          setIsTyping(true)
          stopRef.current = animateFeedback(answer.feedback, setTypewriterText, () => {
            setIsTyping(false)
            if (currentQuestionId) sessionStorage.setItem(animatedKey, 'true')
          })
        }
      } else {
        setTypewriterText('')
      }
    } else {
      setDraftAnswer('')
      setTypewriterText('')
      setIsTyping(false)
    }

    return () => {
      const s = stopRef.current
      if (s) {
        s()
        stopRef.current = null
      }
    }
  }, [currentQuestionId])

  async function triggerAiFeedback() {
    if (!activeQuestion) return

    useExerciseStore.getState().setGeneratingFeedback(true)
    useExerciseStore.getState().setLoadingText('Menganalisis jawaban Anda...')
    setRetryAiError(false)

    try {
      const evalRes = await exerciseApi.requestFeedback(numericTopicId, activeQuestion.id)
      const questionId = activeQuestion.id
      useExerciseStore.getState().saveAnswerRecord(questionId, {
        score: evalRes.score,
        feedback: evalRes.feedback,
      })

      const running = stopRef.current
      if (running) {
        running()
        stopRef.current = null
      }
      setTypewriterText('')
      setIsTyping(true)
      const animatedKey = `feedbackAnimated_${questionId}`
      stopRef.current = animateFeedback(evalRes.feedback, setTypewriterText, () => {
        setIsTyping(false)
        sessionStorage.setItem(animatedKey, 'true')
      })
      toast.success('Evaluasi AI berhasil diterima.')
    } catch (err) {
      setRetryAiError(true)
      toast.error((err as Error)?.message || 'Gagal menghubungi AI. Silakan coba lagi nanti.')
    } finally {
      useExerciseStore.getState().setGeneratingFeedback(false)
      useExerciseStore.getState().setLoadingText('')
    }
  }

  async function handleSubmitAnswer() {
    if (!canSubmit || !activeQuestion) return

    useExerciseStore.getState().setSubmitting(true)
    useExerciseStore.getState().setLoadingText('Sedang menyimpan jawaban...')
    setRetryAiError(false)

    try {
      await exerciseApi.submitAnswer(numericTopicId, activeQuestion.id, draftAnswer.trim())
      useExerciseStore.getState().saveAnswerRecord(activeQuestion.id, {
        answer: draftAnswer.trim(),
        score: 0,
        feedback: null,
      })

      await triggerAiFeedback()
    } catch (err) {
      toast.error((err as Error)?.message || 'Gagal mengirim jawaban.')
    } finally {
      useExerciseStore.getState().setSubmitting(false)
    }
  }

  function handleNext() {
    if (isLastQuestion) {
      navigate({ to: '/endExercise' })
    } else {
      useExerciseStore.getState().next()
    }
  }

  function handlePrev() {
    useExerciseStore.getState().prev()
  }

  function preventAction(e: SyntheticEvent) {
    e.preventDefault()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {isPending ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-neutral-500">Menyiapkan materi latihan...</p>
        </div>
      ) : isError ? (
        <div className="p-8 bg-white border border-neutral-300 rounded-xl text-center space-y-4">
          <AlertCircle size={32} className="mx-auto text-neutral-900" />
          <h3 className="text-base font-bold text-neutral-900">
            {(error as Error)?.message || 'Gagal memuat latihan soal.'}
          </h3>
          <div className="flex justify-center gap-3">
            <Link
              to="/exercise"
              preload="intent"
              className="text-xs px-4 py-2 border border-neutral-300 rounded-lg text-neutral-800 hover:bg-neutral-100 transition-colors"
            >
              Kembali ke Topik
            </Link>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-xs px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      ) : data && data.questions.length === 0 ? (
        <div className="py-20 text-center bg-white border border-neutral-200 rounded-xl p-8 space-y-3">
          <p className="text-sm font-semibold text-neutral-900">Belum ada soal pada topik ini.</p>
          <Link
            to="/exercise"
            preload="intent"
            className="inline-block text-xs px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Kembali ke Katalog
          </Link>
        </div>
      ) : activeQuestion ? (
        <>
          <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
              <span>{topicName}</span>
              <span>
                Soal {currentIndex + 1} dari {questions.length}
              </span>
            </div>
            <ProgressBar percent={progressPercent} />
          </div>

          <div className="bg-white border border-neutral-300 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
            <AntiCheatContainer className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="dark">Soal #{currentIndex + 1}</Badge>
                {isAnswerSaved ? (
                  <Badge variant="outline" className="text-neutral-900 border-neutral-900">
                    <Check size={12} />
                    Jawaban Tersimpan
                  </Badge>
                ) : null}
              </div>

              <div
                className="text-base sm:text-lg font-medium text-neutral-950 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: activeQuestion.question }}
              />

              {activeQuestion.pathImage ? (
                <div className="pt-2">
                  <img
                    src={activeQuestion.pathImage}
                    alt={activeQuestion.imageDescription || 'Ilustrasi Soal'}
                    className="max-h-[50vh] object-contain rounded-lg border border-neutral-200 mx-auto"
                    loading="lazy"
                  />
                  {activeQuestion.imageDescription ? (
                    <p className="text-[11px] text-neutral-500 text-center mt-1.5 italic">
                      {activeQuestion.imageDescription}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </AntiCheatContainer>

            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="answer-input"
                  className="text-xs font-bold text-neutral-900 uppercase tracking-wider"
                >
                  Jawaban Anda
                </label>
                <span
                  className={cn(
                    'text-xs',
                    wordCount < 2 ? 'text-neutral-500' : 'text-neutral-900 font-medium',
                  )}
                >
                  {wordCount} kata{' '}
                  {!isAnswerSaved && wordCount < 2 ? '(minimal 2 kata)' : null}
                </span>
              </div>

              <textarea
                id="answer-input"
                value={draftAnswer}
                onChange={(e) => setDraftAnswer(e.target.value)}
                disabled={isAnswerSaved || isSubmitting}
                readOnly={isAnswerSaved}
                onPaste={preventAction}
                onDrop={preventAction}
                placeholder="Ketikkan jawaban Anda secara mandiri di sini (minimal 2 kata)..."
                rows={5}
                className="w-full p-4 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors disabled:bg-neutral-100 disabled:text-neutral-700 disabled:cursor-not-allowed resize-y"
              />

              {isSubmitting || isGeneratingFeedback ? (
                <div className="flex items-center gap-2.5 p-3 bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900">
                  <Spinner size="sm" />
                  <span>{loadingText || 'Sedang memproses...'}</span>
                </div>
              ) : !isAnswerSaved ? (
                <div className="flex justify-end">
                  <Button variant="primary" disabled={!canSubmit} onClick={handleSubmitAnswer}>
                    <Send size={15} />
                    <span>Kirim Jawaban</span>
                  </Button>
                </div>
              ) : null}

              {isAnswerSaved && (!hasFeedback || retryAiError) ? (
                <div className="p-4 bg-neutral-100 border border-neutral-300 rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-900">
                    <AlertCircle size={16} />
                    <span>Evaluasi AI belum selesai atau mengalami gangguan jaringan.</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerAiFeedback()}
                    disabled={isGeneratingFeedback}
                  >
                    <RefreshCw size={14} />
                    <span>Dapatkan Feedback</span>
                  </Button>
                </div>
              ) : null}

              {hasFeedback || typewriterText ? (
                <div className="mt-4 p-5 bg-neutral-50 border border-neutral-300 rounded-xl space-y-3 transition-opacity">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-950 uppercase tracking-wider">
                      <Sparkles size={15} />
                      <span>Evaluasi &amp; Umpan Balik AI</span>
                    </div>
                    {activeAnswer?.score !== undefined ? (
                      <Badge variant="dark">Skor: {activeAnswer.score} / 3</Badge>
                    ) : null}
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-line font-normal">
                    {typewriterText || activeAnswer?.feedback}
                    {isTyping ? (
                      <span className="inline-block w-1 h-3.5 bg-neutral-900 ml-0.5 align-middle" />
                    ) : null}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="pt-6 border-t border-neutral-200 flex items-center justify-between">
              {!isFirstQuestion ? (
                <Button variant="outline" onClick={handlePrev}>
                  <ChevronLeft size={16} />
                  <span>Sebelumnya</span>
                </Button>
              ) : (
                <div />
              )}

              <Button variant="primary" onClick={handleNext}>
                <span>{isLastQuestion ? 'Selesai Latihan' : 'Selanjutnya'}</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
