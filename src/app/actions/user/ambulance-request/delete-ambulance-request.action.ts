"use server";

import { deleteUserAmbulanceRequestService } from "@/app/services/user/ambulance-request/delete-ambulance-request.service";
import {
  isSuccessResponse,
  UserAmbulanceRequestResult,
} from "@/core/types/user/ambulance-request";

const deleteUserAmbulanceRequests = async ({
  accessToken,
  requestId,
}: {
  accessToken: string;
  requestId: string;
}): Promise<{ data: UserAmbulanceRequestResult | null; error?: string }> => {
  try {
    const res = await deleteUserAmbulanceRequestService({
      accessToken,
      ambulanceRequestId: requestId,
    });

    if (!res) {
      return { data: null, error: "Failed to fetch request" };
    }

    if (isSuccessResponse(res)) {
      return { data: res };
    }

    return {
      data: null,
      error: res.message || "Failed to delete ambulance requests",
    };
  } catch (error) {
    console.error(error);
    return { data: null, error: "An unexpected error occurred" };
  }
};

export default deleteUserAmbulanceRequests;
