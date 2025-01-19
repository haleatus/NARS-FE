import "server-only";

import { z } from "zod";

import { endpoints } from "@/core/contants/endpoints";
import { updateAmbulanceRequestSchema } from "@/app/schema/user/ambulance-request";

export const updateAmbulanceRequestsService = async ({
  accessToken,
  data,
  requestID,
}: {
  accessToken: string;
  data: z.infer<typeof updateAmbulanceRequestSchema>;
  requestID: string;
}) => {
  try {
    const res = await fetch(
      endpoints.user.ambulanceRequest.getUserAmbulanceRequests.replace(
        ":id",
        requestID
      ),
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return {
          statusCode: 404,
          message: "No ambulance requests found",
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
