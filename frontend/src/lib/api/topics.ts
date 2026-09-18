import { api } from './client.ts';
import type { Topic } from '../types/topic.types.ts';

export const topicsApi = {
  async getAll(): Promise<Topic[]> {
    const res = await api.get<Topic[]>('/topics');
    return res.data || [];
  },

  async getById(id: number): Promise<Topic> {
    const res = await api.get<Topic>(`/topics/${id}`);
    return res.data!;
  },

  async create(name: string): Promise<Topic> {
    const res = await api.post<Topic>('/topics', { name });
    return res.data!;
  },

  async update(id: number, name: string): Promise<Topic> {
    const res = await api.put<Topic>(`/topics/${id}`, { name });
    return res.data!;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/topics/${id}`);
  },
};
