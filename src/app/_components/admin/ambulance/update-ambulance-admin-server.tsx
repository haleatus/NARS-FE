import { getCurrentAdminAccessToken } from "@/app/actions/admin/auth/get-current-admin-access-token";
import UpdateAmbulanceClient from "@/components/admin/ambulance/update-ambulance-admin-client";
import React from "react";

const UpdateAmbulanceServer = async () => {
  const adminAccessToken = await getCurrentAdminAccessToken();

  if (!adminAccessToken) {
    return (
      <div>
        <h1>Unauthorized</h1>
      </div>
    );
  }

  return (
    <div>
      <UpdateAmbulanceClient
        adminAccessToken={adminAccessToken}
        ambulanceId={""}
      />
    </div>
  );
};

export default UpdateAmbulanceServer;
