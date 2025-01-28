"use server";

import { getCurrentUserService } from "@/app/services/user/get-current-user.service";
import { cookies } from "next/headers";

const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  try {
    if (!accessToken?.value) {
      // return null data
      return { data: null };
    }
    const user = await getCurrentUserService(accessToken.value);
    return user;
  } catch (error) {
    return error;
  }
};

export default getCurrentUser;
