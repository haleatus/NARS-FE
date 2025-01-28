"use server";

import { cookies } from "next/headers";

export async function getCurrentAmbulanceAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const userAccessTokenData = cookieStore.get("ambulanceAccessToken");

  if (!userAccessTokenData) {
    return null;
  }

  try {
    return userAccessTokenData.value;
  } catch {
    return null;
  }
}
