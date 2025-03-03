/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Ambulance } from "@/core/interface/ambulance.interface";
import {
  IHospital,
  IHospitalSuccessResponse,
} from "@/core/interface/hospital.interface";
import { UserAmbulanceRequestResponse } from "@/core/interface/user/ambulance-request";
import GoogleMap from "../../map/GoogleMap";
import GetAllAmbulanceClient from "../get-all-ambulance-client";
import GetUserAmbulanceRequestClient from "@/components/user/ambulance-request/get-user-ambulance-request-client";

const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const AmbulanceClientV2 = ({
  ambulanceData,
  accessToken,
  requests,
  myRequestExists,
}: {
  ambulanceData: Ambulance[] | null;
  accessToken: string;
  myRequestExists: boolean;
  requests: UserAmbulanceRequestResponse;
}) => {
  const [selectedHospital, setSelectedHospital] = useState<IHospital | null>(
    null
  );

  const [showRouteToHospital, setShowRouteToHospital] = useState(false);

  const [selectedAmbulanceForRoute, setSelectedAmbulanceForRoute] = useState<
    string | undefined
  >();

  const handleNavigateToHospital = (hospital: IHospital) => {
    setSelectedHospital(hospital);
    setShowRouteToHospital(true);
  };

  return (
    <div>
      <div
        className={`relative grid transition-all duration-300 ease-in-out gap-4 h-[440px] md:grid-cols-3`}
      >
        <div
          className={`relative rounded-lg overflow-hidden shadow-inner border-2 border-red-700 ${
            myRequestExists && "col-span-1"
          }`}
        >
          {ambulanceData ? (
            <GoogleMap apiKey={googleApiKey} ambulances={ambulanceData} />
          ) : (
            <div>No ambulance data found</div>
          )}
        </div>
        <div
          className={`bg-white rounded-lg shadow-inner overflow-hidden  border-2 border-black/30 ${
            myRequestExists && "col-span-2"
          }`}
        >
          {myRequestExists ? (
            <>
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">
                  My Current Ambulance Request
                </h3>
              </div>
              <GetUserAmbulanceRequestClient
                requests={requests}
                accessToken={accessToken}
                onNavigateToAmbulance={setSelectedAmbulanceForRoute}
                onNavigateToHospital={handleNavigateToHospital}
              />
            </>
          ) : (
            <>
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">
                  Nearby Ambulances
                </h3>
              </div>
              <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
                {ambulanceData ? (
                  <GetAllAmbulanceClient
                    ambulanceData={ambulanceData}
                    selectedAmbulanceId={selectedAmbulanceForRoute}
                    onNavigateToAmbulance={setSelectedAmbulanceForRoute}
                    accessToken={accessToken}
                    userLocation={[85.333606, 27.705665]}
                    maxDistance={8}
                    selectedHospital={selectedHospital}
                  />
                ) : (
                  <div>No ambulance data found</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmbulanceClientV2;
