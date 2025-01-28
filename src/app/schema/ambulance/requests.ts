import { z } from "zod";

export const updateMyAmbulanceRequestStatusSchema = z.object({
  status: z.string().min(1, "Status must be at least 1 character."),
});
