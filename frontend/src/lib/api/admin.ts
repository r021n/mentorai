import { api } from './client.ts';
import type { MatrixResponse, DbUser, DbAnswer } from '../types/admin.types.ts';

export const adminApi = {
  // Assessment Reports
  async getStudentsAnswersMatrix(topicId: number): Promise<MatrixResponse> {
    const res = await api.get<MatrixResponse>(`/admin/topics/${topicId}/students-answers`);
    return res.data!;
  },

  async downloadExcelReport(topicId: number): Promise<Blob> {
    return api.downloadBlob(`/admin/download/${topicId}`);
  },

  // Raw Database: Users
  async getAllUsers(): Promise<DbUser[]> {
    const res = await api.get<DbUser[]>('/admin/database/users');
    return res.data || [];
  },

  async searchUsers(query: string): Promise<DbUser[]> {
    const res = await api.get<DbUser[]>(`/admin/database/users/search?q=${encodeURIComponent(query)}`);
    return res.data || [];
  },

  async editUser(id: number, data: { username: string; password?: string; role: 'admin' | 'siswa' }): Promise<DbUser> {
    const res = await api.post<DbUser>('/admin/database/users/edit', {
      id,
      username: data.username,
      password: data.password || '',
      role: data.role,
    });
    return res.data!;
  },

  async deleteUsers(ids: number[]): Promise<{ deletedCount: number }> {
    const res = await api.post<{ deletedCount: number }>('/admin/database/users/delete', { ids });
    return res.data!;
  },

  // Raw Database: Answers
  async getAnswers(filters?: { userId?: number; questionId?: number; topicId?: number }): Promise<DbAnswer[]> {
    const params = new URLSearchParams();
    if (filters?.userId !== undefined) params.append('userId', String(filters.userId));
    if (filters?.questionId !== undefined) params.append('questionId', String(filters.questionId));
    if (filters?.topicId !== undefined) params.append('topicId', String(filters.topicId));
    const qs = params.toString();
    const res = await api.get<DbAnswer[]>(`/admin/database/answers${qs ? `?${qs}` : ''}`);
    return res.data || [];
  },

  async editAnswer(
    id: number,
    data: {
      answer: string | null;
      feedback: string | null;
      score: number;
      userId: number;
      questionId: number;
      topicId: number;
    }
  ): Promise<DbAnswer> {
    const res = await api.post<DbAnswer>('/admin/database/answers/edit', {
      id,
      ...data,
    });
    return res.data!;
  },

  async deleteAnswers(ids: number[]): Promise<{ deletedCount: number }> {
    const res = await api.post<{ deletedCount: number }>('/admin/database/answers/delete', { ids });
    return res.data!;
  },
};
