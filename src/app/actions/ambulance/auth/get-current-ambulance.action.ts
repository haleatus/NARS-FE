"use server";

import { getCurrentAmbulanceService } from "@/app/services/ambulance/auth/get-current-ambulance.service";
import { cookies } from "next/headers";

const getCurrentAmbulance = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ambulanceAccessToken");
  try {
    if (!accessToken?.value) {
      throw new Error("Access token is missing");
    }
    const ambulance = await getCurrentAmbulanceService(accessToken.value);
    return ambulance;
  } catch (error) {
    return error;
  }
};

export default getCurrentAmbulance;
