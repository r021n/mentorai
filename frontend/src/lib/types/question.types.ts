export interface Question {
  id: number;
  question: string;
  topicId?: number;
  pathImage: string | null;
  imageDescription: string | null;
  createdAt?: string;
}

export interface CreateQuestionInput {
  question: string;
  topicId: number;
  imageDescription?: string | null;
  image?: File | null;
  pathImage?: string | null;
}

export interface UpdateQuestionInput {
  question?: string;
  imageDescription?: string | null;
  image?: File | null;
  pathImage?: string | null;
}
