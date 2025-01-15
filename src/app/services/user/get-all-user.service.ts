import "server-only";

import { endpoints } from "@/core/contants/endpoints";

export const getAllUserService = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  const response = await fetch(endpoints.user.getAllUsers, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const usersData = await response.json();

  if (!response.ok) {
    const error = new Error(usersData.message || "Failed to fetch");
    throw error;
  }

  return usersData;
};
