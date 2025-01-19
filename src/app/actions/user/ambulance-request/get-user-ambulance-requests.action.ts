"use server";

import { getUserAmbulanceRequestsService } from "@/app/services/user/ambulance-request/get-user-ambulance-request.service";

const getUserAmbulanceRequests = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  try {
    const res = await getUserAmbulanceRequestsService({ accessToken });

    if (!res) {
      return;
    }

    if ("data" in res && res.statusCode === 200) {
      return { data: res };
    }

    return {
      data: null,
      error: res.message || "Failed to fetch user ambulance requests",
    };
  } catch (error) {
    console.error(error);
    return;
  }
};

export default getUserAmbulanceRequests;
