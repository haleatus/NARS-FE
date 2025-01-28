import { getAmbulanceRequestById } from "@/app/actions/admin/ambulance/get-ambulance-request-by-id.action";
import { getCurrentAdminAccessToken } from "@/app/actions/admin/auth/get-current-admin-access-token";
import GetAmbulanceRequestByIdClient from "@/components/admin/ambulance/get-ambulance-request-by-id-admin-client";
import React from "react";

const GetAmbulanceRequestByIdServer = async ({ id }: { id: string }) => {
  const adminAccessToken = await getCurrentAdminAccessToken();

  if (!adminAccessToken) {
    return (
      <div>
        <div>Admin not logged in</div>
      </div>
    );
  }

  const ambulanceRequestsData = await getAmbulanceRequestById(
    adminAccessToken,
    id
  );

  return (
    <div>
      {ambulanceRequestsData ? (
        <GetAmbulanceRequestByIdClient
          ambulanceRequestsData={ambulanceRequestsData}
        />
      ) : (
        <div>No ambulance request with this ID found</div>
      )}
    </div>
  );
};

export default GetAmbulanceRequestByIdServer;
