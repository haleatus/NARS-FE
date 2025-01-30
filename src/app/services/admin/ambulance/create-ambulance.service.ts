import "server-only";

import { endpoints } from "@/core/contants/endpoints";
import { z } from "zod";
import { createAmbulanceSchema } from "@/app/schema/admin/ambulance/ambulance.schema";

const createNewAmbulanceService = async (
  adminAccessToken: string,
  data: z.infer<typeof createAmbulanceSchema>
) => {
  const res = await fetch(endpoints.admin.ambulance.createAmbulance, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${adminAccessToken}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }
  return result;
};

export default createNewAmbulanceService;
