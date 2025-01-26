"use server";

import getAllAmbulanceRequestService from "@/app/services/admin/ambulance/ambulance-request.service";
import { UserAmbulanceRequest } from "@/core/types/user/ambulance-request";

export async function getAllAmbulanceRequest(
  adminAccessToken: string
): Promise<UserAmbulanceRequest[] | null> {
  try {
    const response = await getAllAmbulanceRequestService(adminAccessToken);

    if (!response) {
      return null;
    }

    // If the response is a SuccessResponse, extract the data array
    if ("data" in response && Array.isArray(response.data)) {
      return response.data as UserAmbulanceRequest[];
    }

    return null;
  } catch (error) {
    console.error("Error fetching ambulance:", error);
    return null;
  }
}
