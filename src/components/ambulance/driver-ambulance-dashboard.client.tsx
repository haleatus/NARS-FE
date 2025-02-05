"use client";

import { useState } from "react";
import GetMyAmbulanceRequestClient from "./requests/get-my-ambulance-request-client";
import {
  AmbulanceRequest,
  AmbulanceRequestResponse,
} from "@/core/interface/ambulance/request";
import AmbulanceMap from "../map/ambulance/ambulance-map";

const DriverAmbulanceDashboardClient = ({
  accessToken,
  requests,
}: {
  accessToken: string;
  requests: AmbulanceRequestResponse;
}) => {
  const [showRoutes, setShowRoutes] = useState<
    | {
        ambulanceLocation: [number, number];
        userLocation: [number, number];
        hospitalLocation: [number, number];
      }
    | undefined
  >(undefined);

  const handleNavigate = (request: AmbulanceRequest) => {
    setShowRoutes({
      ambulanceLocation: [
        // parseFloat(request.ambulance.location.longitude),
        // parseFloat(request.ambulance.location.latitude),
        85.281889, 27.691524,
      ],
      userLocation: [
        // parseFloat(request.requester.location.longitude),
        // parseFloat(request.requester.location.latitude),
        85.3111949, 27.705617,
      ],
      hospitalLocation: [
        parseFloat(request.hospital_location.longitude),
        parseFloat(request.hospital_location.latitude),
      ],
    });
  };

  return (
    <div>
      <div
        className={`relative grid transition-all duration-300 ease-in-out gap-4 h-[calc(100vh-90px)] md:grid-cols-2`}
      >
        <div className="relative rounded-lg overflow-hidden shadow-inner border-2 border-red-700">
          <AmbulanceMap
            center={[85.3111949, 27.7056172]} // Centered on Kathmandu
            initialZoom={12}
            showMultiRoute={showRoutes || undefined}
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
