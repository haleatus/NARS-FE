import "server-only";

import { endpoints } from "@/core/contants/endpoints";

export const getCurrentUserService = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  const response = await fetch(endpoints.user.getCurrentUser, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  return null;
};
