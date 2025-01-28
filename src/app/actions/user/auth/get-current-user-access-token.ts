"use server";

import { cookies } from "next/headers";

export async function getCurrentUserAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const userAccessTokenData = cookieStore.get("accessToken");

  if (!userAccessTokenData) {
    return null;
  }

  try {
    return userAccessTokenData.value;
  } catch {
    return null;
  }
}
