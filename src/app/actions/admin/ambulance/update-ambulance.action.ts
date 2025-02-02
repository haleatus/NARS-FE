"use server";

import { updateAmbulanceSchema } from "@/app/schema/admin/ambulance/ambulance.schema";
import updateAmbulanceService from "@/app/services/admin/ambulance/update-ambulance.service";
import { z } from "zod";

const updateAmbulanceAction = async (
  adminAccessToken: string,
  ambulanceId: string,
  updateAmbulanceData: z.infer<typeof updateAmbulanceSchema>
) => {
  try {
    const validatedData = updateAmbulanceSchema.parse(updateAmbulanceData);
    return await updateAmbulanceService(
      adminAccessToken,
      ambulanceId,
      validatedData
    );
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

export default updateAmbulanceAction;
