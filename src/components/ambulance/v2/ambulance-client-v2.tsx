"use client";

import React, { useState } from "react";
import GetAllAmbulanceClientV2 from "./get-all-ambulance-client-v2";
import { Ambulance } from "@/core/interface/ambulance.interface";
import {
  IHospital,
  IHospitalSuccessResponse,
} from "@/core/interface/hospital.interface";
import { UserAmbulanceRequestResponse } from "@/core/interface/user/ambulance-request";
import GetUserAmbulanceRequestClientV2 from "../../user/ambulance-request/v2/get-user-ambulance-request-v2";
import GoogleMap from "../../map/GoogleMap";
import GetAllAmbulanceClient from "../get-all-ambulance-client";
import HospitalList from "../../map/HospitalLists";
import GetUserAmbulanceRequestClient from "@/components/user/ambulance-request/get-user-ambulance-request-client";
import GoogleMapComponent from "../../map/GoogleMap";

const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const AmbulanceClientV2 = ({
  ambulanceData,
  hospitalData,
  accessToken,
  requests,
  myRequestExists,
}: {
  ambulanceData: Ambulance[] | null;
  hospitalData: IHospitalSuccessResponse | null;
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
          {/* Map Section - Now larger and more prominent */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-lg border-2 border-red-600">
            {ambulanceData ? (
              <div className="w-full h-full">
                <GoogleMapComponent
                  apiKey={googleApiKey}
                  ambulances={ambulanceData}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <p className="text-gray-500">No ambulance data available</p>
              </div>
            )}
          </div>

          {/* Info Panel - Streamlined and modern */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="bg-red-50 p-4 border-b border-red-100">
                <h2 className="text-xl font-semibold text-red-900">
                  {myRequestExists
                    ? "Current Request Status"
                    : "Available Ambulances"}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                {myRequestExists ? (
                  <GetUserAmbulanceRequestClient
                    requests={requests}
                    accessToken={accessToken}
                    onNavigateToAmbulance={setSelectedAmbulanceForRoute}
                    onNavigateToHospital={handleNavigateToHospital}
                  />
                ) : (
                  <div className="p-4">
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
                      <div className="text-center py-8 text-gray-500">
                        No nearby ambulances found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceClientV2;
