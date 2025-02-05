"use server";

import { updateMyAmbulanceRequestsStatusService } from "@/app/services/ambulance/requests/update-my-ambulance-request-status.service";
import {
  AmbulanceRequestResult,
  isSuccessResponse,
} from "@/core/interface/ambulance/request";
import { z } from "zod";

const updateMyAmbulanceRequestStatus = async ({
  accessToken,
  status,
  requestID,
}: {
  accessToken: string;
  status: string;
  requestID: string;
}): Promise<{ data: AmbulanceRequestResult | null; error?: string }> => {
  try {
    // Call the service
    const res = await updateMyAmbulanceRequestsStatusService({
      accessToken,
      status,
      requestID,
    });

    if (!res) {
      return {
        data: null,
        error: "Failed to update my ambulance request status",
      };
    }

    if (isSuccessResponse(res)) {
      return { data: res };
    }

    return {
      data: null,
      error: res.message || "Failed to update my ambulance request status",
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

export default updateMyAmbulanceRequestStatus;
