"use server";

import { getCurrentAdminService } from "@/app/services/admin/auth/get-current-admin.service";
import { cookies } from "next/headers";

const getCurrentAdmin = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("adminAccessToken");
  try {
    if (!accessToken?.value) {
      // return null data
      return { data: null };
    }
    const admin = await getCurrentAdminService(accessToken.value);
    return admin;
  } catch (error) {
    return error;
  }
};

export default getCurrentAdmin;
