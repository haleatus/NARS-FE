import { z } from "zod";

export const signInAmbulanceSchema = z.object({
  contact: z.string().min(10, "Contact number must be at least 10 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
