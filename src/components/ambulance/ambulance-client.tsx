"use client";

import React, { useState } from "react";
import MapWrapper from "../map/MapWrapper";
import { MapPin } from "lucide-react";
import GetAllAmbulanceClient from "./get-all-ambulance-client";
import { Ambulance } from "@/core/types/ambulance.interface";
import { IHospitalSuccessResponse } from "@/core/types/hospital.interface";

const AmbulanceClient = ({
  ambulanceData,
  hospitalData,
}: {
  ambulanceData: Ambulance[] | null;
  hospitalData: IHospitalSuccessResponse | null;
}) => {
  const [selectedAmbulanceForRoute, setSelectedAmbulanceForRoute] = useState<
    string | undefined
  >();

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6 h-[440px]">
        <div className="relative rounded-lg overflow-hidden shadow-inner">
          {ambulanceData ? (
            <MapWrapper
              className="h-full w-full"
              ambulanceData={ambulanceData}
              initialZoom={12}
              showRouteToAmbulance={selectedAmbulanceForRoute}
              userLocation={[85.333606, 27.705665]}
              hospitalData={hospitalData}
            />
          ) : (
            <div>No ambulance data found</div>
          )}
          <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-md p-2 shadow">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-blue-500" />
              Ambulance Locations
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-inner overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">
              Ambulance List
            </h3>
          </div>
          <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
            {ambulanceData ? (
              <GetAllAmbulanceClient
                ambulanceData={ambulanceData}
                onNavigateToAmbulance={setSelectedAmbulanceForRoute}
              />
            ) : (
              <div>No ambulance data found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceClient;
