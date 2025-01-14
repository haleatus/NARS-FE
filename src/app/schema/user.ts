import { z } from "zod";

export const createUserSchema = z.object({
  fullname: z.string().min(2, "Full Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  contact: z.string().min(10, "Contact number must be at least 10 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const signInUserSchema = z.object({
  contact: z.string().min(10, "Contact number must be at least 10 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
