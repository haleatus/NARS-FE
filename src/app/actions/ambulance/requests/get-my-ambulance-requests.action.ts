"use server";

import { getMyAmbulanceRequestsService } from "@/app/services/ambulance/requests/get-my-ambuance-requests.service";
import {
  AmbulanceRequestResult,
  isSuccessResponse,
} from "@/core/interface/ambulance/request";

const getMyAmbulanceRequests = async ({
  accessToken,
}: {
  accessToken: string;
}): Promise<{ data: AmbulanceRequestResult | null; error?: string }> => {
  try {
    const res = await getMyAmbulanceRequestsService({ accessToken });

    if (!res) {
      return { data: null, error: "Failed to fetch data" };
    }

    if (isSuccessResponse(res)) {
      return { data: res };
    }

    return {
      data: null,
      error: res.message || "Failed to fetch my ambulance requests",
    };
  } catch (error) {
    console.error(error);
    return { data: null, error: "An unexpected error occurred" };
  }
};

export default getMyAmbulanceRequests;
