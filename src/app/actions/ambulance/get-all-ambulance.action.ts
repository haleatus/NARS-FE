"use server";

import getAllAmbulanceService from "@/app/services/ambulance/get-all-ambulance.service";
import { Ambulance } from "@/core/interface/ambulance.interface";

export async function getAllAmbulance(): Promise<Ambulance[] | null> {
  try {
    const response = await getAllAmbulanceService();

    if (!response) {
      return null;
    }

    // If the response is a SuccessResponse, extract the data array
    if ("data" in response && Array.isArray(response.data)) {
      return response.data as Ambulance[];
    }

    return null;
  } catch (error) {
    console.error("Error fetching ambulance:", error);
    return null;
  }
}
