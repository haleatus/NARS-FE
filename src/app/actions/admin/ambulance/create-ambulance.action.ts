"use server";

import { createAmbulanceSchema } from "@/app/schema/admin/ambulance/ambulance.schema";
import createNewAmbulanceService from "@/app/services/admin/ambulance/create-ambulance.service";
import { z } from "zod";

const createAmbulanceAction = async ({
  adminAccessToken,
  createAmbulanceData,
}: {
  adminAccessToken: string;
  createAmbulanceData: z.infer<typeof createAmbulanceSchema>;
}) => {
  try {
    const validatedData = createAmbulanceSchema.parse(createAmbulanceData);

    const res = await createNewAmbulanceService(
      adminAccessToken,
      validatedData
    );

    return res;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: error.errors.map((e) => `${e.message}`).join(", "),
      };
    }

    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
  }
};

export default createAmbulanceAction;
