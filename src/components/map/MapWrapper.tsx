"use client";

import React from "react";
import Map from "./Map";
import { Ambulance } from "@/core/types/ambulance.interface";

interface MapWrapperProps {
  className?: string;
  ambulanceData: Ambulance[];
  initialZoom: number;
  userLocation?: [number, number];
  showRouteToAmbulance?: string;
}

const MapWrapper: React.FC<MapWrapperProps> = ({
  className,
  ambulanceData,
  initialZoom,
  userLocation,
  showRouteToAmbulance,
}) => {
  // Use a default center point (can be adjusted based on your needs)
  const center: [number, number] = React.useMemo(() => {
    if (ambulanceData.length > 0) {
      return [
        Number(ambulanceData[0].location.longitude),
        Number(ambulanceData[0].location.latitude),
      ];
    }
    return [-73.935242, 40.73061]; // Default coordinates
  }, [ambulanceData]);

  return (
    <div className={className}>
      <Map
        ambulanceData={ambulanceData}
        center={center}
        initialZoom={initialZoom}
        userLocation={userLocation}
        showRouteToAmbulance={showRouteToAmbulance}
      />
    </div>
  );
};

export default MapWrapper;
