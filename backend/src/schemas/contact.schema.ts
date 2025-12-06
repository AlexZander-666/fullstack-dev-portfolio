import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(1, "Message is required").max(5000, "Message too long"),
});

export type ContactInput = z.infer<typeof contactSchema>;
