import { getCurrentAdminAccessToken } from "@/app/actions/admin/auth/get-current-admin-access-token";
import { getAllAmbulance } from "@/app/actions/ambulance/get-all-ambulance.action";
import GetAllAmbulanceAdminClient from "@/components/admin/ambulance/get-all-ambulance-admin-client";
import React from "react";

const GetAllAmbulanceAdminServer = async () => {
  const ambulanceData = await getAllAmbulance();

  const adminAccessToken = await getCurrentAdminAccessToken();

  if (!ambulanceData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {ambulanceData ? (
        <GetAllAmbulanceAdminClient
          ambulanceData={ambulanceData}
          adminAccessToken={adminAccessToken ?? ""}
        />
      ) : (
        <div>No ambulance data found</div>
      )}
    </div>
  );
};

export default GetAllAmbulanceAdminServer;
