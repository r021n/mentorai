import type { Question } from './question.types';

export interface AnswerRecord {
  id?: number;
  questionId: number;
  answer: string;
  feedback: string | null;
  score: number;
  userId?: number;
  topicId?: number;
  createdAt?: string;
}

export interface ExerciseDataResponse {
  topic: { id: number; name: string };
  questions: Question[];
  answers: AnswerRecord[];
}

export interface MyAnswerItem {
  questionId: number;
  questionText: string;
  pathImage: string | null;
  studentAnswer: string;
  feedback: string | null;
  score: number;
}

export interface MyAnswersSummary {
  topic: { id: number; name: string };
  totalQuestions: number;
  answeredQuestions: number;
  totalScore: number;
  maxPossibleScore: number;
  scorePercentage: number;
  answers: MyAnswerItem[];
}
