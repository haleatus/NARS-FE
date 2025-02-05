// types.ts
interface RouteInfo {
  distance: string;
  duration: number;
}

interface RouteDistanceCalculatorProps {
  userLocation: [number, number];
  ambulanceLocation: [number, number];
}

interface MapboxDirectionsResponse {
  routes: Array<{
    distance: number;
    duration: number;
  }>;
}

// RouteDistanceCalculator.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Route } from "lucide-react";

const RouteDistanceCalculator: React.FC<RouteDistanceCalculatorProps> = ({
  userLocation,
  ambulanceLocation,
}) => {
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const calculateRoute = async () => {
      try {
        // Format coordinates for Mapbox Directions API
        const coords = `${ambulanceLocation[0]},${ambulanceLocation[1]};${userLocation[0]},${userLocation[1]}`;

        // Make request to Mapbox Directions API
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        );

        const data: MapboxDirectionsResponse = await response.json();

        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          setRouteInfo({
            distance: (route.distance / 1000).toFixed(2), // Convert to km
            duration: Math.ceil(route.duration / 60), // Convert to minutes
          });
        }
      } catch (error) {
        console.error("Error calculating route:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userLocation && ambulanceLocation) {
      calculateRoute();
    }
  }, [userLocation, ambulanceLocation]);

  if (loading) {
    return <div className="p-4">Calculating route...</div>;
  }

  return (
    <Card className="w-full bg-white/50 font-sans font-semibold">
      <CardContent className="p-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Route className="size-3 text-blue-500" />
            <span className="text-xs">
              Distance: <strong>{routeInfo?.distance} km</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-3 text-blue-500" />
            <span className="text-xs">
              Estimated arrival: <strong>{routeInfo?.duration} minutes</strong>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteDistanceCalculator;
