"use server";

import { getCurrentUserService } from "@/app/services/user/get-current-user.service";

export const getCurrentUserFromApi = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  try {
    const res = await getCurrentUserService({ accessToken });

    if (!res) {
      return { data: null, error: "User not found" };
    }

    if ("data" in res && res.statusCode === 200) {
      return { data: res.data };
    }
  } catch (error) {
    console.error(error);
    return;
  }
};
