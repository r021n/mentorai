import { describe, it, expect, beforeEach } from '../test-utils.ts';
import { ExerciseRunnerState } from '../../src/lib/stores/exercise.svelte.ts';
import type { Question } from '../../src/lib/types/question.types.ts';
import type { AnswerRecord } from '../../src/lib/types/answer.types.ts';

describe('ExerciseRunnerState Store Tests', () => {
  let state: ExerciseRunnerState;

  const mockQuestions: Question[] = [
    { id: 101, question: 'Soal 1', pathImage: null, imageDescription: null },
    { id: 102, question: 'Soal 2', pathImage: null, imageDescription: null },
    { id: 103, question: 'Soal 3', pathImage: null, imageDescription: null },
  ];

  const mockExistingAnswers: AnswerRecord[] = [
    { id: 1, questionId: 101, answer: 'Jawaban Soal 1', feedback: 'Bagus', score: 3 },
  ];

  beforeEach(() => {
    state = new ExerciseRunnerState();
  });

  it('should initialize with default state', () => {
    expect(state.questions).toEqual([]);
    expect(state.currentIndex).toBe(0);
  });

  it('should load topic, questions, and existing answers correctly', () => {
    state.loadData({ id: 1, name: 'Struktur Data' }, mockQuestions, mockExistingAnswers);

    expect(state.topicId).toBe(1);
    expect(state.topicName).toBe('Struktur Data');
    expect(state.questions.length).toBe(3);
    expect(state.currentQuestion?.id).toBe(101);
    expect(state.answersMap[101]?.answer).toBe('Jawaban Soal 1');
  });

  it('should navigate next and previous questions', () => {
    state.loadData({ id: 1, name: 'Struktur Data' }, mockQuestions, []);

    state.next();
    expect(state.currentIndex).toBe(1);
    expect(state.currentQuestion?.id).toBe(102);

    state.next();
    expect(state.currentIndex).toBe(2);
    expect(state.currentQuestion?.id).toBe(103);

    // Cannot go beyond last question
    state.next();
    expect(state.currentIndex).toBe(2);

    state.prev();
    expect(state.currentIndex).toBe(1);

    state.goTo(0);
    expect(state.currentIndex).toBe(0);
  });

  it('should save answer records to answersMap', () => {
    state.loadData({ id: 1, name: 'Struktur Data' }, mockQuestions, []);

    state.saveAnswerRecord(102, {
      answer: 'Ini jawaban kedua',
      score: 2,
      feedback: 'Cukup tepat',
    });

    expect(state.answersMap[102]).toBeDefined();
    expect(state.answersMap[102].answer).toBe('Ini jawaban kedua');
    expect(state.answersMap[102].score).toBe(2);
    expect(state.answersMap[102].feedback).toBe('Cukup tepat');
  });
});
