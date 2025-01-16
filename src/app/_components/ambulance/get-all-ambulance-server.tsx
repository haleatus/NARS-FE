import { getAllAmbulance } from "@/app/actions/ambulance/get-all-ambulance.action";
import { getCurrentUserAccessToken } from "@/app/actions/user/get-current-user-access-token";
import GetAllAmbulanceClient from "@/components/ambulance/get-all-ambulance-client";
import React from "react";

const GetAllAmbulanceServer = async () => {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    return <div>Access token not found</div>;
  }

  const ambulanceData = await getAllAmbulance(accessToken);

  return (
    <div>
      {ambulanceData ? (
        <GetAllAmbulanceClient ambulanceData={ambulanceData} />
      ) : (
        <div>No ambulance data found</div>
      )}
    </div>
  );
};

export default GetAllAmbulanceServer;
