import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500, "Excerpt too long").optional(),
  coverImage: z.string().url("Invalid URL").optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const postQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  published: z.enum(["true", "false"]).optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostQueryInput = z.infer<typeof postQuerySchema>;
