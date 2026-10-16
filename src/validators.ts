import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(60),
});

export const createNoteSchema = z.object({
  title: z.string().trim().min(1).max(255),
  content: z.string().trim().min(1),
});

export const updateNoteSchema = createNoteSchema
  .partial()
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "At least one field (title or content) is required",
  });

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
