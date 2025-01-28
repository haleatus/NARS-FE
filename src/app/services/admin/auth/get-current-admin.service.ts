import "server-only";

import { endpoints } from "@/core/contants/endpoints";

export const getCurrentAdminService = async (accessToken: string) => {
  const response = await fetch(endpoints.admin.auth.getCurrentAdmin, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const adminData = await response.json();

  if (!response.ok) {
    throw new Error(adminData.message);
  }

  return adminData;
};
