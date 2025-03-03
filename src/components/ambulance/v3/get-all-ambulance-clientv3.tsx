"use client";

import { Ambulance } from "@/core/interface/ambulance.interface";
import { MapPin, Phone, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";

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

  // Calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
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
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  // Filter and sort hospitals
  const nearbyAmbulances = useMemo(() => {
    try {
      // First add distances and filter by max distance
      const ambulanceWithDistance: AmbulanceWithDistance[] = ambulanceData
        .map((ambulance) => ({
          ...ambulance,
          distance: calculateDistance(
            userLocation[1],
            userLocation[0],
            parseFloat(ambulance.location.latitude),
            parseFloat(ambulance.location.longitude)
          ),
        }))
        .filter((ambulance) => ambulance.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);

      return ambulanceWithDistance;
    } catch (error) {
      console.error("Filter error:", error);
      return [];
    }
  }, [ambulanceData, userLocation, maxDistance]);

  return (
    <div className="container mx-auto p-4 font-work-sans">
      <div className="grid grid-cols-1 gap-4">
        {nearbyAmbulances.length > 0 ? (
          nearbyAmbulances.map((ambulance) => (
            <Card key={ambulance._id} className={`relative overflow-hidden `}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold">
                    {ambulance.driver_name}
                  </h2>
                  <Badge
                    variant={
                      ambulance.status === "AVAILABLE"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {ambulance.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Ambulance Number:</span>{" "}
                  {ambulance.ambulance_number}
                </p>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  {ambulance.contact}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  {formatDistance(ambulance.distance)}
                </div>
                <div className="flex justify-between items-center font-sans">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAmbulance(ambulance);
                          setIsDialogOpen(true);
                        }}
                        className="flex items-center gap-2"
                        disabled={
                          ambulance.status === "OCCUPIED" ? true : false
                        }
                      >
                        <Plus className="w-4 h-4" />
                        Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[485px] p-0 rounded-sm">
                      <DialogHeader className="hidden">
                        <DialogTitle>Request Ambulance</DialogTitle>
                      </DialogHeader>

                      {selectedAmbulance && (
                        <CreateAmbulanceRequestFormV3
                          ambulanceId={selectedAmbulance._id}
                          ambulanceNumber={selectedAmbulance.ambulance_number}
                          ambulanceDriver={selectedAmbulance.driver_name}
                          accessToken={accessToken}
                          onSuccess={() => {
                            setIsDialogOpen(false); // Close dialog on success
                            router.refresh();
                          }}
                          onCancel={() => {
                            setIsDialogOpen(false); // Close dialog on cancel
                          }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No nearby hospitals found
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllAmbulanceClientV3;
