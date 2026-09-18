<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { exerciseApi } from '../../lib/api/exercise';
  import { exerciseStore } from '../../lib/stores/exercise.svelte';
  import { toast } from '../../lib/stores/toast.svelte';
  import { countWords, isValidAnswer } from '../../lib/utils/validation';
  import { animateFeedback } from '../../lib/utils/typewriter';
  import AntiCheatContainer from '../../lib/components/AntiCheatContainer.svelte';
  import ProgressBar from '../../lib/components/ui/ProgressBar.svelte';
  import Button from '../../lib/components/ui/Button.svelte';
  import Spinner from '../../lib/components/ui/Spinner.svelte';
  import Badge from '../../lib/components/ui/Badge.svelte';
  import {
    ChevronLeft,
    ChevronRight,
    Send,
    RefreshCw,
    Sparkles,
    AlertCircle,
    Check
  } from '@lucide/svelte';

  interface Props {
    topicId: string;
  }

  let { topicId }: Props = $props();

  let isLoading = $state(true);
  let errorMessage = $state('');
  let draftAnswer = $state('');
  let typewriterText = $state('');
  let isTyping = $state(false);
  let stopTypewriter: (() => void) | null = null;
  let retryAiError = $state(false);

  const numericTopicId = $derived(Number(topicId));
  const activeQuestion = $derived(exerciseStore.currentQuestion);
  const activeAnswer = $derived(exerciseStore.currentAnswerRecord);
  const isAnswerSaved = $derived(!!activeAnswer?.answer);
  const hasFeedback = $derived(!!activeAnswer?.feedback);
  const wordCount = $derived(countWords(draftAnswer));
  const canSubmit = $derived(isValidAnswer(draftAnswer) && !exerciseStore.isSubmitting && !isAnswerSaved);

  async function loadExercise() {
    isLoading = true;
    errorMessage = '';
    try {
      const data = await exerciseApi.getExerciseData(numericTopicId);
      exerciseStore.loadData(data.topic, data.questions, data.answers);
      syncDraftFromStore();
    } catch (err: any) {
      errorMessage = err.message || 'Gagal memuat latihan soal.';
      toast.error(errorMessage);
    } finally {
      isLoading = false;
    }
  }

  function syncDraftFromStore() {
    if (stopTypewriter) {
      stopTypewriter();
      stopTypewriter = null;
    }
    retryAiError = false;

    if (activeAnswer?.answer) {
      draftAnswer = activeAnswer.answer;
      if (activeAnswer.feedback) {
        const animatedKey = `feedbackAnimated_${activeQuestion?.id}`;
        const alreadyAnimated = sessionStorage.getItem(animatedKey);
        if (alreadyAnimated) {
          typewriterText = activeAnswer.feedback;
          isTyping = false;
        } else {
          typewriterText = '';
          isTyping = true;
          stopTypewriter = animateFeedback(
            activeAnswer.feedback,
            (partial) => {
              typewriterText = partial;
            },
            () => {
              isTyping = false;
              if (activeQuestion?.id) {
                sessionStorage.setItem(animatedKey, 'true');
              }
            }
          );
        }
      } else {
        typewriterText = '';
      }
    } else {
      draftAnswer = '';
      typewriterText = '';
      isTyping = false;
    }
  }

  // Effect to sync when current question index changes
  $effect(() => {
    // track index
    const _ = exerciseStore.currentIndex;
    syncDraftFromStore();
  });

  onDestroy(() => {
    if (stopTypewriter) {
      stopTypewriter();
    }
  });

  onMount(() => {
    loadExercise();
  });

  async function handleSubmitAnswer() {
    if (!canSubmit || !activeQuestion) return;

    exerciseStore.isSubmitting = true;
    exerciseStore.loadingText = 'Sedang menyimpan jawaban...';
    retryAiError = false;

    try {
      // Step 1: Submit Answer
      await exerciseApi.submitAnswer(numericTopicId, activeQuestion.id, draftAnswer.trim());
      exerciseStore.saveAnswerRecord(activeQuestion.id, {
        answer: draftAnswer.trim(),
        score: 0,
        feedback: null,
      });

      // Step 2: Automatically request AI feedback
      await triggerAiFeedback();
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengirim jawaban.');
    } finally {
      exerciseStore.isSubmitting = false;
    }
  }

  async function triggerAiFeedback() {
    if (!activeQuestion) return;

    exerciseStore.isGeneratingFeedback = true;
    exerciseStore.loadingText = 'Menganalisis jawaban Anda...';
    retryAiError = false;

    try {
      const evalRes = await exerciseApi.requestFeedback(numericTopicId, activeQuestion.id);
      exerciseStore.saveAnswerRecord(activeQuestion.id, {
        score: evalRes.score,
        feedback: evalRes.feedback,
      });

      // Trigger typewriter animation
      typewriterText = '';
      isTyping = true;
      const animatedKey = `feedbackAnimated_${activeQuestion.id}`;
      stopTypewriter = animateFeedback(
        evalRes.feedback,
        (partial) => {
          typewriterText = partial;
        },
        () => {
          isTyping = false;
          sessionStorage.setItem(animatedKey, 'true');
        }
      );
      toast.success('Evaluasi AI berhasil diterima.');
    } catch (err: any) {
      retryAiError = true;
      toast.error(err.message || 'Gagal menghubungi AI. Silakan coba lagi nanti.');
    } finally {
      exerciseStore.isGeneratingFeedback = false;
      exerciseStore.loadingText = '';
    }
  }

  function handleNext() {
    if (exerciseStore.isLastQuestion) {
      window.location.hash = '#/endExercise';
    } else {
      exerciseStore.next();
    }
  }

  function handlePrev() {
    exerciseStore.prev();
  }

  function preventAction(e: Event) {
    e.preventDefault();
  }
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
  {#if isLoading}
    <div class="py-24 flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p class="text-xs text-neutral-500">Menyiapkan materi latihan...</p>
    </div>
  {:else if errorMessage}
    <div class="p-8 bg-white border border-neutral-300 rounded-xl text-center space-y-4">
      <AlertCircle size={32} class="mx-auto text-neutral-900" />
      <h3 class="text-base font-bold text-neutral-900">{errorMessage}</h3>
      <div class="flex justify-center gap-3">
        <a
          href="#/exercise"
          class="text-xs px-4 py-2 border border-neutral-300 rounded-lg text-neutral-800 hover:bg-neutral-100 transition-colors"
        >
          Kembali ke Topik
        </a>
        <button
          type="button"
          onclick={loadExercise}
          class="text-xs px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  {:else if exerciseStore.questions.length === 0}
    <div class="py-20 text-center bg-white border border-neutral-200 rounded-xl p-8 space-y-3">
      <p class="text-sm font-semibold text-neutral-900">Belum ada soal pada topik ini.</p>
      <a
        href="#/exercise"
        class="inline-block text-xs px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
      >
        Kembali ke Katalog
      </a>
    </div>
  {:else if activeQuestion}
    <!-- Top Progress Bar & Header -->
    <div class="bg-white border border-neutral-200 rounded-xl p-5 space-y-3">
      <div class="flex items-center justify-between text-xs font-semibold text-neutral-600">
        <span>{exerciseStore.topicName}</span>
        <span>
          Soal {exerciseStore.currentIndex + 1} dari {exerciseStore.questions.length}
        </span>
      </div>
      <ProgressBar percent={exerciseStore.progressPercent} />
    </div>

    <!-- Question Container with Anti-Cheat -->
    <div class="bg-white border border-neutral-300 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
      <AntiCheatContainer class="space-y-4">
        <div class="flex items-center gap-2">
          <Badge variant="dark">Soal #{exerciseStore.currentIndex + 1}</Badge>
          {#if isAnswerSaved}
            <Badge variant="outline" class="text-neutral-900 border-neutral-900">
              <Check size={12} />
              Jawaban Tersimpan
            </Badge>
          {/if}
        </div>

        <div class="text-base sm:text-lg font-medium text-neutral-950 leading-relaxed prose max-w-none">
          {@html activeQuestion.question}
        </div>

        {#if activeQuestion.pathImage}
          <div class="pt-2">
            <img
              src={activeQuestion.pathImage.startsWith('http') ? activeQuestion.pathImage : activeQuestion.pathImage}
              alt={activeQuestion.imageDescription || 'Ilustrasi Soal'}
              class="max-h-[50vh] object-contain rounded-lg border border-neutral-200 mx-auto"
              loading="lazy"
            />
            {#if activeQuestion.imageDescription}
              <p class="text-[11px] text-neutral-500 text-center mt-1.5 italic">
                {activeQuestion.imageDescription}
              </p>
            {/if}
          </div>
        {/if}
      </AntiCheatContainer>

      <!-- Answer Input Section -->
      <div class="space-y-3 pt-4 border-t border-neutral-200">
        <div class="flex items-center justify-between">
          <label for="answer-input" class="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Jawaban Anda
          </label>
          <span class="text-xs {wordCount < 2 ? 'text-neutral-500' : 'text-neutral-900 font-medium'}">
            {wordCount} kata {#if !isAnswerSaved && wordCount < 2}(minimal 2 kata){/if}
          </span>
        </div>

        <textarea
          id="answer-input"
          bind:value={draftAnswer}
          disabled={isAnswerSaved || exerciseStore.isSubmitting}
          readonly={isAnswerSaved}
          onpaste={preventAction}
          ondrop={preventAction}
          placeholder="Ketikkan jawaban Anda secara mandiri di sini (minimal 2 kata)..."
          rows={5}
          class="w-full p-4 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors disabled:bg-neutral-100 disabled:text-neutral-700 disabled:cursor-not-allowed resize-y"
        ></textarea>

        <!-- Loading State or Submit Button -->
        {#if exerciseStore.isSubmitting || exerciseStore.isGeneratingFeedback}
          <div class="flex items-center gap-2.5 p-3 bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900">
            <Spinner size="sm" />
            <span>{exerciseStore.loadingText || 'Sedang memproses...'}</span>
          </div>
        {:else if !isAnswerSaved}
          <div class="flex justify-end">
            <Button
              variant="primary"
              disabled={!canSubmit}
              onclick={handleSubmitAnswer}
            >
              <Send size={15} />
              <span>Kirim Jawaban</span>
            </Button>
          </div>
        {/if}

        <!-- Retry AI Feedback Button if AI failed -->
        {#if isAnswerSaved && (!hasFeedback || retryAiError)}
          <div class="p-4 bg-neutral-100 border border-neutral-300 rounded-lg space-y-3">
            <div class="flex items-center gap-2 text-xs font-medium text-neutral-900">
              <AlertCircle size={16} />
              <span>Evaluasi AI belum selesai atau mengalami gangguan jaringan.</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onclick={triggerAiFeedback}
              disabled={exerciseStore.isGeneratingFeedback}
            >
              <RefreshCw size={14} />
              <span>Dapatkan Feedback</span>
            </Button>
          </div>
        {/if}

        <!-- AI Feedback Panel -->
        {#if hasFeedback || typewriterText}
          <div class="mt-4 p-5 bg-neutral-50 border border-neutral-300 rounded-xl space-y-3 transition-opacity">
            <div class="flex items-center justify-between border-b border-neutral-200 pb-2.5">
              <div class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-950 uppercase tracking-wider">
                <Sparkles size={15} />
                <span>Evaluasi & Umpan Balik AI</span>
              </div>
              {#if activeAnswer?.score !== undefined}
                <Badge variant="dark">
                  Skor: {activeAnswer.score} / 3
                </Badge>
              {/if}
            </div>

            <p class="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-line font-normal">
              {typewriterText || activeAnswer?.feedback}
              {#if isTyping}
                <span class="inline-block w-1 h-3.5 bg-neutral-900 ml-0.5 align-middle"></span>
              {/if}
            </p>
          </div>
        {/if}
      </div>

      <!-- Navigation Prev / Next Buttons -->
      <div class="pt-6 border-t border-neutral-200 flex items-center justify-between">
        {#if !exerciseStore.isFirstQuestion}
          <Button
            variant="outline"
            onclick={handlePrev}
          >
            <ChevronLeft size={16} />
            <span>Sebelumnya</span>
          </Button>
        {:else}
          <div></div>
        {/if}

        <Button
          variant="primary"
          onclick={handleNext}
        >
          <span>{exerciseStore.isLastQuestion ? 'Selesai Latihan' : 'Selanjutnya'}</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  {/if}
</div>
