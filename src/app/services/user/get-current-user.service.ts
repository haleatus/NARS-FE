import "server-only";

import { endpoints } from "@/core/contants/endpoints";

export const getCurrentUserService = async (accessToken: string) => {
  const response = await fetch(endpoints.user.getCurrentUser, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const userData = await response.json();

  if (!response.ok) {
    throw new Error(userData.message);
  }

  return userData;
};
