import "server-only";

import { endpoints } from "@/core/contants/endpoints";

const deleteAmbulanceService = async (
  adminAccessToken: string,
  ambulanceId: string
) => {
  const res = await fetch(
    endpoints.admin.ambulance.deleteAmbulance.replace(":id", ambulanceId),
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminAccessToken}`,
      },
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }
  return result;
};

export default deleteAmbulanceService;
