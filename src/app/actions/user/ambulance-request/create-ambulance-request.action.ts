"use server";

import { createAmbulanceRequestSchema } from "@/app/schema/user/ambulance-request";
import { createAmbulanceRequestsService } from "@/app/services/user/ambulance-request/create-ambulance-request.service";
import {
  isSuccessResponse,
  UserAmbulanceRequestResult,
} from "@/core/interface/user/ambulance-request";
import { z } from "zod";

type RequestResponse = {
  success: boolean;
  data: UserAmbulanceRequestResult | null;
  error?: string;
};

const createAmbulanceRequest = async ({
  accessToken,
  createAmbulanceRequestData,
}: {
  accessToken: string;
  createAmbulanceRequestData: z.infer<typeof createAmbulanceRequestSchema>;
}): Promise<RequestResponse> => {
  try {
    // Validate the input data
    const validatedData = createAmbulanceRequestSchema.parse(
      createAmbulanceRequestData
    );

    // Call the service
    const res = await createAmbulanceRequestsService({
      accessToken,
      data: validatedData,
    });

    // Handle null response
    if (!res) {
      return {
        success: false,
        data: null,
        error: "Failed to create ambulance request",
      };
    }

    // Handle success response
    if (isSuccessResponse(res)) {
      return {
        success: true,
        data: res,
      };
    }

    // Handle error response from service
    return {
      success: false,
      data: null,
      error: res.message || "Failed to create ambulance request",
    };
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        error: error.errors.map((e) => `${e.message}`).join(", "),
      };
    }

    // Log unexpected errors
    console.error("Unexpected error in createAmbulanceRequest:", error);

    // Handle unexpected errors
    return {
      success: false,
      data: null,
      error: "An unexpected error occurred",
    };
  }
};

export default createAmbulanceRequest;
