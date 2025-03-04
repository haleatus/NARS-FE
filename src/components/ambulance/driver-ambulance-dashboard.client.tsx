// DriverAmbulanceDashboardClient.tsx
"use client";

import { useState } from "react";
import GetMyAmbulanceRequestClient from "./requests/get-my-ambulance-request-client";
import {
  AmbulanceRequest,
  AmbulanceRequestResponse,
} from "@/core/interface/ambulance/request";
import DriverMap from "../map/driver-map";

const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const DriverAmbulanceDashboardClient = ({
  accessToken,
  requests,
}: {
  accessToken: string;
  requests: AmbulanceRequestResponse;
}) => {
  const [selectedRequest, setSelectedRequest] =
    useState<AmbulanceRequest | null>(null);

  const handleNavigate = (request: AmbulanceRequest) => {
    setSelectedRequest(request);
  };

  let ambulanceLocation: [number, number] | null = null;
  let userLocation: [number, number] | null = null;
  let hospitalLocation: [number, number] | null = null;

  if (selectedRequest) {
    ambulanceLocation = [
      parseFloat(selectedRequest.ambulance.location.longitude),
      parseFloat(selectedRequest.ambulance.location.latitude),
    ];
    userLocation = [
      parseFloat(selectedRequest.requester.location?.longitude || "85.363654"),
      parseFloat(selectedRequest.requester.location?.latitude || "27.719549"),
    ];
    hospitalLocation = [
      parseFloat(selectedRequest.hospital_location.longitude),
      parseFloat(selectedRequest.hospital_location.latitude),
    ];
  }

  return (
    <div className="px-4">
      <div
        className={`relative grid transition-all duration-300 ease-in-out gap-4 h-[calc(100vh-90px)] md:grid-cols-2`}
      >
        <div className="relative rounded-lg overflow-hidden shadow-inner border-2 border-red-700">
          <DriverMap
            apiKey={googleApiKey}
            ambulanceLocation={ambulanceLocation}
            userLocation={userLocation}
            hospitalLocation={hospitalLocation}
          />
        </div>

        <div className="bg-white rounded-lg shadow-inner overflow-hidden  border-2 border-black/30">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">My Requests</h3>
          </div>
          <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
            <GetMyAmbulanceRequestClient
              requests={requests}
              accessToken={accessToken}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAmbulanceDashboardClient;
