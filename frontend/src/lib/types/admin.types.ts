export interface StudentMatrixAnswer {
  answer: string | null;
  feedback: string | null;
  score: number;
}

export interface StudentMatrixRow {
  userId: number;
  username: string;
  totalScore: number;
  answers: Record<number, StudentMatrixAnswer>;
}

export interface MatrixResponse {
  questions: Array<{ id: number; question: string }>;
  students: StudentMatrixRow[];
}

export interface DbUser {
  id: number;
  username: string;
  role: 'admin' | 'siswa';
  createdAt?: string;
}

export interface DbAnswer {
  id: number;
  userId: number;
  username?: string;
  questionId: number;
  questionText?: string;
  topicId: number;
  topicName?: string;
  answer: string | null;
  feedback: string | null;
  score: number;
  createdAt?: string;
}
