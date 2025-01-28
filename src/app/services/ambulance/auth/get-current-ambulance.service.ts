import "server-only";

import { endpoints } from "@/core/contants/endpoints";

export const getCurrentAmbulanceService = async (accessToken: string) => {
  const response = await fetch(endpoints.ambulance.auth.getCurrentAmbulance, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const ambulanceData = await response.json();

  if (!response.ok) {
    throw new Error(ambulanceData.message);
  }

  return ambulanceData;
};
