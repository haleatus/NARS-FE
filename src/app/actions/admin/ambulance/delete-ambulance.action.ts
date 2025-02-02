"use server";

import deleteAmbulanceService from "@/app/services/admin/ambulance/delete-ambulance.service";

const deleteAmbulanceAction = async (
  adminAccessToken: string,
  ambulanceId: string
) => {
  try {
    return await deleteAmbulanceService(adminAccessToken, ambulanceId);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
};

export default deleteAmbulanceAction;
