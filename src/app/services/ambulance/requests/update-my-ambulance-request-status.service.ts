import "server-only";

import { endpoints } from "@/core/contants/endpoints";

export const updateMyAmbulanceRequestsStatusService = async ({
  accessToken,
  status,
  requestID,
}: {
  accessToken: string;
  status: string;
  requestID: string;
}) => {
  try {
    const res = await fetch(
      endpoints.ambulance.ambulanceRequests.updateStatus.replace(
        ":id",
        requestID
      ),
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: status,
        }),
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return {
          statusCode: 404,
          message: "No my ambulance requests found",
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
    console.error(
      "Network error in updateMyAmbulanceRequestsStatusService:",
      error
    );
    return null;
  }
};
