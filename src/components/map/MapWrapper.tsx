import React from "react";
import Map from "./Map";
import { Ambulance } from "@/core/types/ambulance.interface";
import RouteDistanceCalculator from "./RouteDIstanceCalculator";
import { IHospital } from "@/core/types/hospital.interface";

interface MapWrapperProps {
  className?: string;
  ambulanceData: Ambulance[];
  initialZoom: number;
  userLocation?: [number, number];
  showRouteToAmbulance?: string;
  selectedHospital: IHospital | null;
  showRouteToHospital?: boolean;
}

const MapWrapper: React.FC<MapWrapperProps> = ({
  className,
  ambulanceData,
  initialZoom,
  userLocation,
  showRouteToAmbulance,
  selectedHospital,
  showRouteToHospital,
}) => {
  const center: [number, number] = React.useMemo(() => {
    if (ambulanceData.length > 0) {
      return [
        Number(ambulanceData[0].location.longitude),
        Number(ambulanceData[0].location.latitude),
      ];
    }
    return [-73.935242, 40.73061]; // Default coordinates
  }, [ambulanceData]);

  const selectedAmbulance = React.useMemo(() => {
    if (!showRouteToAmbulance) return null;
    return ambulanceData.find((a) => a._id === showRouteToAmbulance);
  }, [ambulanceData, showRouteToAmbulance]);

  const ambulanceLocation = React.useMemo(() => {
    if (!selectedAmbulance) return null;
    return [
      Number(selectedAmbulance.location.longitude),
      Number(selectedAmbulance.location.latitude),
    ] as [number, number];
  }, [selectedAmbulance]);

  return (
    <div className={className}>
      <Map
        ambulanceData={ambulanceData}
        center={center}
        initialZoom={initialZoom}
        userLocation={userLocation}
        showRouteToAmbulance={showRouteToAmbulance}
        selectedHospital={selectedHospital}
        showRouteToHospital={showRouteToHospital}
      />
      <div className="absolute bottom-0 right-0 z-50">
        {userLocation && ambulanceLocation && (
          <RouteDistanceCalculator
            userLocation={userLocation}
            ambulanceLocation={ambulanceLocation}
          />
        )}
      </div>
    </div>
  );
};

export default MapWrapper;
