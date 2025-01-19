"use server";

import { createAmbulanceRequestSchema } from "@/app/schema/user/ambulance-request";
import { createAmbulanceRequestsService } from "@/app/services/user/ambulance-request/create-ambulance-request.service";
import {
  isSuccessResponse,
  UserAmbulanceRequestResult,
} from "@/core/types/user/ambulance-request";
import { z } from "zod";

const createAmbulanceRequest = async ({
  accessToken,
  createAmbulanceRequestData,
}: {
  accessToken: string;
  createAmbulanceRequestData: z.infer<typeof createAmbulanceRequestSchema>;
}): Promise<{ data: UserAmbulanceRequestResult | null; error?: string }> => {
  try {
    // Validate the input data
    const validatedData = createAmbulanceRequestSchema.parse(
      createAmbulanceRequestData
    );

    console.log("validatedData=====", validatedData);

    // Call the service
    const res = await createAmbulanceRequestsService({
      accessToken,
      data: validatedData,
    });

    console.log("ashla=====", res);

    if (!res) {
      return { data: null, error: "Failed to create ambulance request" };
    }

    if (isSuccessResponse(res)) {
      return { data: res };
    }

    return {
      data: null,
      error: res.message || "Failed to create ambulance request",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: error.errors.map((e) => `${e.message}`).join(", "),
      };
    }

    console.error(error);

    return { data: null, error: "An unexpected error occurred" };
  }
};

export default createAmbulanceRequest;
