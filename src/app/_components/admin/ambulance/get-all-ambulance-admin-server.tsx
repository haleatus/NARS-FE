import { getAllAmbulance } from "@/app/actions/ambulance/get-all-ambulance.action";
import GetAllAmbulanceAdminClient from "@/components/admin/ambulance/get-all-ambulance-admin-client";
import React from "react";

const GetAllAmbulanceAdminServer = async () => {
  const ambulanceData = await getAllAmbulance();

  return (
    <div>
      {ambulanceData ? (
        <GetAllAmbulanceAdminClient ambulanceData={ambulanceData} />
      ) : (
        <div>No ambulance data found</div>
      )}
    </div>
  );
};

export default GetAllAmbulanceAdminServer;
