import type { Question } from '../types/question.types';
import type { AnswerRecord } from '../types/answer.types';

export class ExerciseRunnerState {
  topicId = $state<number>(0);
  topicName = $state<string>('');
  questions = $state<Question[]>([]);
  answersMap = $state<Record<number, AnswerRecord>>({});
  currentIndex = $state<number>(0);
  isSubmitting = $state<boolean>(false);
  isGeneratingFeedback = $state<boolean>(false);
  loadingText = $state<string>('');

  get currentQuestion(): Question | null {
    return this.questions[this.currentIndex] || null;
  }

  get progressPercent(): number {
    return this.questions.length > 0
      ? ((this.currentIndex + 1) / this.questions.length) * 100
      : 0;
  }

  get isFirstQuestion(): boolean {
    return this.currentIndex === 0;
  }

  get isLastQuestion(): boolean {
    return this.questions.length > 0 && this.currentIndex === this.questions.length - 1;
  }

  get currentAnswerRecord(): AnswerRecord | null {
    return this.currentQuestion ? this.answersMap[this.currentQuestion.id] || null : null;
  }

  loadData(topic: { id: number; name: string }, questions: Question[], existingAnswers: AnswerRecord[]) {
    this.topicId = topic.id;
    this.topicName = topic.name;
    this.questions = questions;
    const map: Record<number, AnswerRecord> = {};
    for (const ans of existingAnswers) {
      map[ans.questionId] = ans;
    }
    this.answersMap = map;
    this.currentIndex = 0;
    this.isSubmitting = false;
    this.isGeneratingFeedback = false;
    this.loadingText = '';
  }

  saveAnswerRecord(questionId: number, record: Partial<AnswerRecord>) {
    const existing = this.answersMap[questionId] || {
      questionId,
      answer: '',
      feedback: null,
      score: 0,
    };
    this.answersMap = {
      ...this.answersMap,
      [questionId]: {
        ...existing,
        ...record,
      },
    };
  }

  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.questions.length) {
      this.currentIndex = index;
    }
  }
}

export const exerciseStore = new ExerciseRunnerState();
