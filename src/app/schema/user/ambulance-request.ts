import { z } from "zod";

export const createAmbulanceRequestSchema = z.object({
  ambulance: z.string().min(1, "Ambulance ID must be at least 1 character."),
  hospital_location: z.object({
    latitude: z.string().min(1, "Latitude must be at least 1 character."),
    longitude: z.string().min(1, "Longitude must be at least 1 character."),
  }),
});
