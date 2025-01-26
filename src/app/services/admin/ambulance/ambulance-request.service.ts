import "server-only";

import { endpoints } from "@/core/contants/endpoints";

const getAllAmbulanceRequestService = async (adminAccessToken: string) => {
  try {
    const res = await fetch(endpoints.admin.ambulanceRequest.getAllRequest, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminAccessToken}`,
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return {
          statusCode: 404,
          message: "No ambulance found",
          data: null,
        };
      }
      return null;
    }
    // Safely parse JSON
    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      return null;
    }

    return data;
  } catch (error) {
    // Log network errors but don't throw
    console.error("Network error in getAllAmbulanceRequestService:", error);
    return null;
  }
};

export default getAllAmbulanceRequestService;
