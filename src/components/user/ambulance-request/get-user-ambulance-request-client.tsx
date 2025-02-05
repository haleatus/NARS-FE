/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UserAmbulanceRequestResponse } from "@/core/types/user/ambulance-request";
import React from "react";
import { AmbulanceRequestItem } from "./ambulance-request-item";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { IHospital } from "@/core/types/hospital.interface";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

interface Props {
  requests: UserAmbulanceRequestResponse;
  accessToken: string;
  onNavigateToAmbulance?: (ambulanceId: string) => void;
  onNavigateToHospital: (hospital: IHospital) => void;
}

const GetUserAmbulanceRequestClient: React.FC<Props> = ({
  requests,
  accessToken,
  onNavigateToAmbulance,
  onNavigateToHospital,
}) => {
  const router = useRouter();

  const handleUpdateAndDelete = () => {
    router.refresh();
  };

  if (!requests.data) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No ambulance requests found
      </Card>
    );
  }

  const handleNavigate = (requests: any) => {
    if (onNavigateToAmbulance) {
      onNavigateToAmbulance(requests.data.ambulance);
    }
    onNavigateToHospital({
      name: "",
      amenity: "",
      latitude: parseFloat(requests.data.hospital_location.latitude),
      longitude: parseFloat(requests.data.hospital_location.longitude),
    });
  };

  return (
    <div className="flex flex-col p-2 gap-4">
      <AmbulanceRequestItem
        data={requests.data}
        accessToken={accessToken}
        onUpdate={handleUpdateAndDelete}
        onDelete={handleUpdateAndDelete}
      />
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => handleNavigate(requests)}
      >
        <Navigation size={16} />
        Navigate
      </Button>
    </div>
  );
};

export default GetUserAmbulanceRequestClient;
