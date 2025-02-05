import { z } from "zod";

export const createAmbulanceSchema = z.object({
  driver_name: z.string(),
  ambulance_number: z.string(),
  contact: z.string().min(10, "Contact number must be at least 10 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  location: z.object({
    latitude: z.string().min(1, "Latitude must be at least 1 character."),
    longitude: z.string().min(1, "Longitude must be at least 1 character."),
  }),
});

export const updateAmbulanceSchema = z.object({
  driver_name: z.string().optional(),
  ambulance_number: z.string().optional(),
  contact: z
    .string()
    .min(10, "Contact number must be at least 10 characters.")
    .optional(),
  location: z
    .object({
      latitude: z.string().min(1, "Latitude must be at least 1 character."),
      longitude: z.string().min(1, "Longitude must be at least 1 character."),
    })
    .optional(),
});
