"use client";

import { UserAmbulanceRequestResponse } from "@/core/types/user/ambulance-request";
import React from "react";
import { AmbulanceRequestItem } from "./ambulance-request-item";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Props {
  requests: UserAmbulanceRequestResponse;
  accessToken: string;
}

const GetUserAmbulanceRequestClient: React.FC<Props> = ({
  requests,
  accessToken,
}) => {
  const router = useRouter();

  const handleUpdate = () => {
    router.refresh();
  };

  if (!requests.data) {
    return (
      <Card className="p-6 max-w-2xl mx-auto my-4">
        <p className="text-center text-muted-foreground">
          No ambulance request found
        </p>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ambulance Request Details</h1>
      <AmbulanceRequestItem
        data={requests.data}
        accessToken={accessToken}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default GetUserAmbulanceRequestClient;
