import { getAllAmbulance } from "@/app/actions/ambulance/get-all-ambulance.action";
import GetAllAmbulanceClient from "@/components/ambulance/get-all-ambulance-client";
import React from "react";

const GetAllAmbulanceServer = async () => {
  const ambulanceData = await getAllAmbulance();

  console.log("ambulanceData", ambulanceData);

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
