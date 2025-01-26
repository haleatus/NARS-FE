"use server";

import getAmbulanceRequestByIdService from "@/app/services/admin/ambulance/ambulance-request-by-id.service";
import { UserAmbulanceRequest } from "@/core/types/user/ambulance-request";

export async function getAmbulanceRequestById(
  adminAccessToken: string,
  requestId: string
): Promise<UserAmbulanceRequest | null> {
  try {
    const response = await getAmbulanceRequestByIdService(
      adminAccessToken,
      requestId
    );

    if (!response) {
      return null;
    }

    // If the response is a SuccessResponse, extract the data array
    if ("data" in response) {
      return response.data as UserAmbulanceRequest;
    }

    return null;
  } catch (error) {
    console.error("Error fetching ambulance:", error);
    return null;
  }
}
