"use client";

// import React, { useState } from "react";
// import { IHospital } from "@/core/types/hospital.interface";
import GetMyAmbulanceRequestClient from "./requests/get-my-ambulance-request-client";
import { AmbulanceRequestResponse } from "@/core/types/ambulance/request";

const DriverAmbulanceDashboardClient = ({
  accessToken,
  requests,
}: {
  accessToken: string;
  requests: AmbulanceRequestResponse;
}) => {
  //   const [selectedHospital, setSelectedHospital] = useState<IHospital | null>(
  //     null
  //   );
  //   const [showRouteToHospital, setShowRouteToHospital] = useState(false);

  //   const [selectedAmbulanceForRoute, setSelectedAmbulanceForRoute] = useState<
  //     string | undefined
  //   >();

  // console.log("selectedAmbulanceForRoute", selectedAmbulanceForRoute); // This will provide ambulance ID

  //   const handleNavigateToHospital = (hospital: IHospital) => {
  //     setSelectedHospital(hospital);
  //     setShowRouteToHospital(true);
  //   };

  return (
    <div>
      <div
        className={`relative grid transition-all duration-300 ease-in-out gap-4 h-[440px] md:grid-cols-2`}
      >
        <div className="relative rounded-lg overflow-hidden shadow-inner border-2 border-red-700">
          Map
        </div>

        <div className="bg-white rounded-lg shadow-inner overflow-hidden  border-2 border-black/30">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">My Requests</h3>
          </div>
          <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
            <GetMyAmbulanceRequestClient
              requests={requests}
              accessToken={accessToken}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAmbulanceDashboardClient;
