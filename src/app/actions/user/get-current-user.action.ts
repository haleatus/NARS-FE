"use server";

import { User } from "@/core/types/user.interface";
import { cookies } from "next/headers";

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userData = cookieStore.get("userData");

  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData.value);
  } catch {
    return null;
  }
}
