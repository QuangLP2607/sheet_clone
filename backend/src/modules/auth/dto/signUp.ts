import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email("Invalid email"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .optional(),
});

export type SignUpDto = z.infer<typeof signUpSchema>;
