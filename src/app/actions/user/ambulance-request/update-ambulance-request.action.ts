"use server";

import { updateAmbulanceRequestSchema } from "@/app/schema/user/ambulance-request";
import { updateAmbulanceRequestsService } from "@/app/services/user/ambulance-request/update-ambulance-request.service";
import {
  isSuccessResponse,
  UserAmbulanceRequestResult,
} from "@/core/interface/user/ambulance-request";
import { z } from "zod";

const updateAmbulanceRequest = async ({
  accessToken,
  updateAmbulanceRequestData,
  requestID,
}: {
  accessToken: string;
  updateAmbulanceRequestData: z.infer<typeof updateAmbulanceRequestSchema>;
  requestID: string;
}): Promise<{ data: UserAmbulanceRequestResult | null; error?: string }> => {
  try {
    // Validate the input data
    const validatedData = updateAmbulanceRequestSchema.parse(
      updateAmbulanceRequestData
    );

    // Call the service
    const res = await updateAmbulanceRequestsService({
      accessToken,
      data: validatedData,
      requestID,
    });

    if (!res) {
      return { data: null, error: "Failed to update ambulance request" };
    }

    if (isSuccessResponse(res)) {
      return { data: res };
    }

    return {
      data: null,
      error: res.message || "Failed to update ambulance request",
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

export default updateAmbulanceRequest;
