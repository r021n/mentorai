import { z } from "zod";

export const submitAnswerSchema = z.object({
  questionId: z.number().int().positive("ID soal harus berupa integer positif"),
  answer: z
    .string()
    .min(1, "Jawaban tidak boleh kosong")
    .refine(
      (val) => val.trim().split(/\s+/).filter(Boolean).length >= 2,
      "Jawaban minimal 2 kata"
    ),
});

export const requestFeedbackSchema = z.object({
  questionId: z.number().int().positive("ID soal harus berupa integer positif"),
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type RequestFeedbackInput = z.infer<typeof requestFeedbackSchema>;
