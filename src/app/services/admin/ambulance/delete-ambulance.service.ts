import "server-only";

import { endpoints } from "@/core/contants/endpoints";

const deleteAmbulanceService = async (
  adminAccessToken: string,
  ambulanceId: string
) => {
  try {
    const res = await fetch(
      endpoints.admin.ambulance.updateAmbulance.replace(":id", ambulanceId),
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return result.error;
    }

    return result;
  } catch (error) {
    console.error("Network error in deleteAmbulance:", error);
    return null;
  }
};

export default deleteAmbulanceService;
