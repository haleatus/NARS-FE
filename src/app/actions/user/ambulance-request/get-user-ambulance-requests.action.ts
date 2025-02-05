"use server";

import { getUserAmbulanceRequestsService } from "@/app/services/user/ambulance-request/get-user-ambulance-request.service";
import {
  isSuccessResponse,
  UserAmbulanceRequestResult,
} from "@/core/interface/user/ambulance-request";

const getUserAmbulanceRequests = async ({
  accessToken,
}: {
  accessToken: string;
}): Promise<{ data: UserAmbulanceRequestResult | null; error?: string }> => {
  try {
    const res = await getUserAmbulanceRequestsService({ accessToken });

    if (!res) {
      return { data: null, error: "Failed to fetch data" };
    }

    if (isSuccessResponse(res)) {
      return { data: res };
    }

    return {
      data: null,
      error: res.message || "Failed to fetch user ambulance requests",
    };
  } catch (error) {
    console.error(error);
    return { data: null, error: "An unexpected error occurred" };
  }
};

export default getUserAmbulanceRequests;
