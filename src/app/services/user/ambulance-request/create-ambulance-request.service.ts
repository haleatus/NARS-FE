import "server-only";

import { z } from "zod";

import { endpoints } from "@/core/contants/endpoints";
import { createAmbulanceRequestSchema } from "@/app/schema/user/ambulance-request";

export const createAmbulanceRequestsService = async ({
  accessToken,
  data,
}: {
  accessToken: string;
  data: z.infer<typeof createAmbulanceRequestSchema>;
}) => {
  try {
    const res = await fetch(endpoints.user.ambulanceRequest.requestAmbulance, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      if (res.status === 409) {
        return {
          statusCode: 409,
          message: "An ambulance request already exists",
          data: null,
        };
      }
      return null;
    }

    let result;
    try {
      result = await res.json();
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      return null;
    }

    return result;
  } catch (error) {
    console.error("Network error in getUserAmbulanceRequestsService:", error);
    return null;
  }
};
