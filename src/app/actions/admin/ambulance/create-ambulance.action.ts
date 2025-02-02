"use server";

import { createAmbulanceSchema } from "@/app/schema/admin/ambulance/ambulance.schema";
import createNewAmbulanceService from "@/app/services/admin/ambulance/create-ambulance.service";
import { z } from "zod";

const createAmbulanceAction = async (
  adminAccessToken: string,
  createAmbulanceData: z.infer<typeof createAmbulanceSchema>
) => {
  try {
    const validatedData = createAmbulanceSchema.parse(createAmbulanceData);

    return await createNewAmbulanceService(adminAccessToken, validatedData);
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof z.ZodError
          ? error.errors.map((e) => e.message).join(", ")
          : error instanceof Error
          ? error.message
          : "An error occurred",
    };
  }
};

export default createAmbulanceAction;
