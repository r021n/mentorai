import { api } from './client.ts';
import type { Topic } from '../types/topic.types.ts';
import type { ExerciseDataResponse } from '../types/answer.types.ts';

export interface SubmitAnswerResult {
  answerId: number;
}

export interface AiFeedbackResult {
  score: number;
  feedback: string;
}

export const exerciseApi = {
  async getExerciseTopics(): Promise<Topic[]> {
    const res = await api.get<Topic[]>('/exercise/topics');
    return res.data || [];
  },

  async getExerciseData(topicId: number): Promise<ExerciseDataResponse> {
    const res = await api.get<ExerciseDataResponse>(`/exercise/${topicId}`);
    return res.data!;
  },

  async submitAnswer(topicId: number, questionId: number, answer: string): Promise<SubmitAnswerResult> {
    const res = await api.post<SubmitAnswerResult>(`/exercise/${topicId}/submit`, {
      questionId,
      answer,
    });
    return res.data!;
  },

  async requestFeedback(topicId: number, questionId: number): Promise<AiFeedbackResult> {
    const res = await api.post<AiFeedbackResult>(`/exercise/${topicId}/feedback`, {
      questionId,
    });
    return res.data!;
  },
};
