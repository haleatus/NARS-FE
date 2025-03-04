"use client";

import type { Ambulance } from "@/core/interface/ambulance.interface";
import { MapPin, Phone, Plus } from "lucide-react";
import type React from "react";
import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateAmbulanceRequestFormV3 } from "@/components/user/ambulance-request/v3/create-ambulance-request-formv3";

interface GetAllAmbulanceClientProps {
  ambulanceData: Ambulance[];
  accessToken: string;
  userLocation: [number, number];
  maxDistance?: number;
}

interface AmbulanceWithDistance extends Ambulance {
  distance: number;
}

const GetAllAmbulanceClientV3: React.FC<GetAllAmbulanceClientProps> = ({
  ambulanceData,
  accessToken,
  userLocation,
  maxDistance = 8,
}) => {
  const router = useRouter();
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const nearbyAmbulances = useMemo(() => {
    try {
      const ambulanceWithDistance: AmbulanceWithDistance[] = ambulanceData
        .map((ambulance) => ({
          ...ambulance,
          distance: calculateDistance(
            userLocation[1],
            userLocation[0],
            Number.parseFloat(ambulance.location.latitude),
            Number.parseFloat(ambulance.location.longitude)
          ),
        }))
        .filter((ambulance) => ambulance.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);

      return ambulanceWithDistance;
    } catch (error) {
      console.error("Filter error:", error);
      return [];
    }
  }, [ambulanceData, userLocation, maxDistance, calculateDistance]);

  return (
    <div className="w-full space-y-4 p-2">
      {nearbyAmbulances.length > 0 ? (
        nearbyAmbulances.map((ambulance) => (
          <Card
            key={ambulance._id}
            className="overflow-hidden border-none shadow-sm hover:shadow-black/60 transition-all duration-300 bg-white shadow-black/30"
          >
            <CardContent className="p-4">
              <div className="flex flex-col space-y-3">
                {/* Header with driver name and status */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      {ambulance.driver_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">
                        {ambulance.driver_name}
                      </h3>
                      <p className="text-md text-gray-500">
                        {ambulance.ambulance_number}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      ambulance.status === "AVAILABLE" ? "green" : "destructive"
                    }
                    className="text-sm font-medium px-2 py-1 font-sans cursor-pointer"
                  >
                    {ambulance.status}
                  </Badge>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 text-md">
                  <InfoItem
                    icon={<Phone className="w-4 h-4 text-blue-500" />}
                    label="Contact"
                    value={ambulance.contact}
                  />
                  <InfoItem
                    icon={<MapPin className="w-4 h-4 text-red-500" />}
                    label="Distance"
                    value={formatDistance(ambulance.distance)}
                  />
                </div>

                {/* Request button */}
                <div className="flex justify-end pt-2">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAmbulance(ambulance);
                          setIsDialogOpen(true);
                        }}
                        className="border-gray-200 text-blue-500 hover:text-blue-600 hover:bg-blue-50 font-sans text-md"
                        disabled={ambulance.status !== "AVAILABLE"}
                      >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Request Ambulance
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="sm:max-w-[500px] p-0"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <DialogHeader className="p-4 bg-gray-50 border-b hidden">
                        <DialogTitle>Request Ambulance</DialogTitle>
                      </DialogHeader>
                      {selectedAmbulance && (
                        <CreateAmbulanceRequestFormV3
                          ambulanceId={selectedAmbulance._id}
                          ambulanceNumber={selectedAmbulance.ambulance_number}
                          ambulanceDriver={selectedAmbulance.driver_name}
                          accessToken={accessToken}
                          onSuccess={() => {
                            setIsDialogOpen(false);
                            router.refresh();
                          }}
                          onCancel={() => setIsDialogOpen(false)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="p-6 text-center text-muted-foreground bg-white border-none shadow-sm">
          No nearby ambulances found
        </Card>
      )}
    </div>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 font-sans">
    <div className="bg-gray-100 p-1.5 rounded-md">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-md">{value}</p>
    </div>
  </div>
);

export default GetAllAmbulanceClientV3;
