import "server-only";

import { endpoints } from "@/core/contants/endpoints";

export const getAllUserService = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  try {
    const res = await fetch(endpoints.admin.user.getAllUsers, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return {
          statusCode: 404,
          message: "No users found",
          data: null,
        };
      }
      return null;
    }

    // Safely parse JSON
    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      return null;
    }

    return data;
  } catch (error) {
    // Log network errors but don't throw
    console.error("Network error in getAllUserService:", error);
    return null;
  }
};
