import "server-only";

import { endpoints } from "@/core/contants/endpoints";
import { z } from "zod";
import { updateAmbulanceSchema } from "@/app/schema/admin/ambulance/ambulance.schema";

const updateAmbulanceService = async (
  adminAccessToken: string,
  ambulanceId: string,
  data: z.infer<typeof updateAmbulanceSchema>
) => {
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
    throw new Error(result.message);
  }
  return result;
};

export default updateAmbulanceService;
