import { z } from "zod";

export const topicSchema = z.object({
  name: z.string().min(1, "Nama topik tidak boleh kosong").max(255, "Nama topik terlalu panjang"),
});

export type TopicInput = z.infer<typeof topicSchema>;
