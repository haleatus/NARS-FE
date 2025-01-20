import "server-only";

import { endpoints } from "@/core/contants/endpoints";

export const deleteUserAmbulanceRequestService = async ({
  accessToken,
  ambulanceRequestId,
}: {
  accessToken: string;
  ambulanceRequestId: string;
}) => {
  try {
    const res = await fetch(
      endpoints.user.ambulanceRequest.deleteAmbulanceRequest.replace(
        ":id",
        ambulanceRequestId
      ),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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

    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Network error in deleteUserAmbulanceRequestService:", error);
    return null;
  }
};
