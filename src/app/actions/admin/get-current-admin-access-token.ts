"use server";

import { cookies } from "next/headers";

export async function getCurrentAdminAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const userAccessTokenData = cookieStore.get("adminAccessToken");

  if (!userAccessTokenData) {
    return null;
  }

  try {
    return userAccessTokenData.value;
  } catch {
    return null;
  }
}
