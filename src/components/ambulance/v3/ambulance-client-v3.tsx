"use client";

import React from "react";
import { Ambulance } from "@/core/interface/ambulance.interface";
import { UserAmbulanceRequestResponse } from "@/core/interface/user/ambulance-request";
import GetUserAmbulanceRequestClientV3 from "@/components/user/ambulance-request/v3/get-user-ambulance-request-clientv3";
import GetAllAmbulanceClientV3 from "./get-all-ambulance-clientv3";
import GoogleMapComponent from "@/components/map/GoogleMapComponent";

const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const AmbulanceClientV3 = ({
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
  return (
    <div>
      <div
        className={`relative grid transition-all duration-300 ease-in-out gap-4 h-[440px] md:grid-cols-2`}
      >
        <div
          className={`relative rounded-lg overflow-hidden shadow-inner border-2 border-red-700`}
        >
          {ambulanceData ? (
            <GoogleMapComponent
              apiKey={googleApiKey}
              ambulances={ambulanceData}
            />
          ) : (
            <div>No ambulance data found</div>
          )}
        </div>

        <div
          className={`bg-white rounded-lg shadow-inner overflow-hidden  border-2 border-black/30`}
        >
          {myRequestExists ? (
            <>
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">
                  My Current Ambulance Request
                </h3>
              </div>
              <GetUserAmbulanceRequestClientV3
                requests={requests}
                accessToken={accessToken}
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
                  <GetAllAmbulanceClientV3
                    ambulanceData={ambulanceData}
                    accessToken={accessToken}
                    userLocation={[85.333606, 27.705665]}
                    maxDistance={8}
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

export default AmbulanceClientV3;
