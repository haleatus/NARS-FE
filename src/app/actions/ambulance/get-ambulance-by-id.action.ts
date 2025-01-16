"use server";

import getAmbulanceByIdService from "@/app/services/ambulance/get-ambulance-by-id.service";
import { Ambulance } from "@/core/types/ambulance.interface";

export async function getAmbulanceById(
  accessToken: string,
  id: string
): Promise<Ambulance | null> {
  try {
    const response = await getAmbulanceByIdService(accessToken, id);

    if (!response) {
      return null;
    }

    // If the response is a SuccessResponse, extract the data
    if ("data" in response) {
      return response.data as Ambulance;
    }

    return null;
  } catch (error) {
    console.error("Error fetching ambulance:", error);
    return null;
  }
}
