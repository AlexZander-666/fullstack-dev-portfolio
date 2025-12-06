import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description too long"),
  techStack: z.array(z.string()).min(1, "At least one technology is required"),
  imageUrl: z.string().url("Invalid URL").optional(),
  liveUrl: z.string().url("Invalid URL").optional(),
  githubUrl: z.string().url("Invalid URL").optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
