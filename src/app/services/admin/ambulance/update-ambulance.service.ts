import "server-only";

import { endpoints } from "@/core/contants/endpoints";
import { z } from "zod";
import { updateAmbulanceSchema } from "@/app/schema/admin/ambulance/ambulance.schema";

const updateAmbulanceService = async (
  adminAccessToken: string,
  ambulanceId: string,
  data: z.infer<typeof updateAmbulanceSchema>
) => {
  try {
    const res = await fetch(
      endpoints.admin.ambulance.updateAmbulance.replace(":id", ambulanceId),
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${adminAccessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return result.error;
    }

    return result;
  } catch (error) {
    console.error("Network error in updateAmbulance:", error);
    return null;
  }
};

export default updateAmbulanceService;
