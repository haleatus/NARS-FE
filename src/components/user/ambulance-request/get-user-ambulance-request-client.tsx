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

  return (
    <div className="flex flex-col p-2 gap-4">
      <AmbulanceRequestItem
        data={requests.data}
        accessToken={accessToken}
        onUpdate={handleUpdateAndDelete}
        onDelete={handleUpdateAndDelete}
      />
    </div>
  );
};

export default GetUserAmbulanceRequestClient;
