import "server-only";

import { endpoints } from "@/core/contants/endpoints";

export const getAllHospitalService = async () => {
  const res = await fetch(endpoints.hospital.getAllHospital);

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }
  return result;
};
