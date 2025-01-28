"use server";

import { getAllAdminService } from "@/app/services/admin/get-all-admin.service";

const getAllAdmin = async ({ accessToken }: { accessToken: string }) => {
  try {
    const res = await getAllAdminService({ accessToken });

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

export default getAllAdmin;
