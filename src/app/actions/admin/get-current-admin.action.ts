"use server";

import { Admin } from "@/core/types/admin.interface";
import { cookies } from "next/headers";

export async function getCurrentAdmin(): Promise<Admin | null> {
  const cookieStore = await cookies();
  const adminData = cookieStore.get("adminData");

  if (!adminData) {
    return null;
  }

  try {
    return JSON.parse(adminData.value);
  } catch {
    return null;
  }
}
