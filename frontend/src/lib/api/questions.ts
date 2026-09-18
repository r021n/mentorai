import { api } from './client.ts';
import type { Question, CreateQuestionInput, UpdateQuestionInput } from '../types/question.types.ts';

export const questionsApi = {
  async getByTopic(topicId: number): Promise<Question[]> {
    const res = await api.get<Question[]>(`/topics/${topicId}/questions`);
    return res.data || [];
  },

  async getById(id: number): Promise<Question> {
    const res = await api.get<Question>(`/questions/${id}`);
    return res.data!;
  },

  async create(input: CreateQuestionInput): Promise<Question> {
    if (input.image) {
      const formData = new FormData();
      formData.append('question', input.question);
      if (input.imageDescription) {
        formData.append('imageDescription', input.imageDescription);
      }
      formData.append('image', input.image);
      const res = await api.upload<Question>(`/topics/${input.topicId}/questions`, formData, 'POST');
      return res.data!;
    } else {
      const res = await api.post<Question>(`/topics/${input.topicId}/questions`, {
        question: input.question,
        imageDescription: input.imageDescription || null,
        pathImage: input.pathImage || null,
      });
      return res.data!;
    }
  },

  async update(id: number, input: UpdateQuestionInput): Promise<Question> {
    if (input.image) {
      const formData = new FormData();
      if (input.question !== undefined) formData.append('question', input.question);
      if (input.imageDescription !== undefined && input.imageDescription !== null) {
        formData.append('imageDescription', input.imageDescription);
      }
      formData.append('image', input.image);
      const res = await api.upload<Question>(`/questions/${id}`, formData, 'PUT');
      return res.data!;
    } else {
      const res = await api.put<Question>(`/questions/${id}`, {
        question: input.question,
        imageDescription: input.imageDescription,
        pathImage: input.pathImage,
      });
      return res.data!;
    }
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/questions/${id}`);
  },
};
