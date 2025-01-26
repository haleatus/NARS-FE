import { getAllAmbulanceRequest } from "@/app/actions/admin/ambulance/get-all-ambulance-request.action";
import { getCurrentAdminAccessToken } from "@/app/actions/admin/get-current-admin-access-token";
import GetAllAmbulanceRequestClient from "@/components/admin/ambulance/get-all-ambulance-request-admin-client";
import React from "react";

const GetAllAmbulanceRequestServer = async () => {
  const adminAccessToken = await getCurrentAdminAccessToken();

  if (!adminAccessToken) {
    return (
      <div>
        <div>Admin not logged in</div>
      </div>
    );
  }

  const ambulanceRequestsData = await getAllAmbulanceRequest(adminAccessToken);

  return (
    <div>
      {ambulanceRequestsData ? (
        <GetAllAmbulanceRequestClient
          ambulanceRequestsData={ambulanceRequestsData}
        />
      ) : (
        <div>No ambulance requests found</div>
      )}
    </div>
  );
};

export default GetAllAmbulanceRequestServer;
