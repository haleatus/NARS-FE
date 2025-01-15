"use server";

import { getAllUserService } from "@/app/services/user/get-all-user.service";

const getAllUsers = async ({ accessToken }: { accessToken: string }) => {
  try {
    const res = await getAllUserService({ accessToken });

    if (!res) {
      return;
    }

    if ("data" in res && res.statusCode === 200) {
      return { data: res.data };
    }

    return { data: null, error: res.message || "Failed to fetch" };
  } catch (error) {
    console.error(error);
    return;
  }
};

export default getAllUsers;
