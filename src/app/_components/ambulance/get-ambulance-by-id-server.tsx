import { getAmbulanceById } from "@/app/actions/ambulance/get-ambulance-by-id.action";
import { getCurrentUserAccessToken } from "@/app/actions/user/get-current-user-access-token";
import GetAmbulanceByIdClient from "@/components/ambulance/get-ambulance-by-id-client";
import React from "react";

const GetAmbulanceByIdServer = async ({ id }: { id: string }) => {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    return <div>Access token not found</div>;
  }

  const ambulanceData = await getAmbulanceById(accessToken, id);

  return (
    <div>
      {ambulanceData ? (
        <GetAmbulanceByIdClient ambulanceData={ambulanceData} />
      ) : (
        <div>No ambulance data found</div>
      )}
    </div>
  );
};

export default GetAmbulanceByIdServer;
