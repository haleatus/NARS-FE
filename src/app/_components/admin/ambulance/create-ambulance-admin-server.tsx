import { getCurrentAdminAccessToken } from "@/app/actions/admin/auth/get-current-admin-access-token";
import CreateAmbulanceClient from "@/components/admin/ambulance/create-ambulance-admin-client";
import { defaultConfig } from "next/dist/server/config-shared";
import React from "react";

const CreateAmbulanceServer = async () => {
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
      <CreateAmbulanceClient adminAccessToken={adminAccessToken} />
    </div>
  );
};

export default CreateAmbulanceServer;
