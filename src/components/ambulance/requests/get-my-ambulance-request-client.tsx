"use client";

import React from "react";
import { RequestItem } from "./request-item";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { AmbulanceRequestResponse } from "@/core/types/ambulance/request";

interface Props {
  requests: AmbulanceRequestResponse;
  accessToken: string;
}

const GetMyAmbulanceRequestClient: React.FC<Props> = ({
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
        No requests found
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
      {requests.data.map((request) => (
        <RequestItem
          key={request._id}
          data={request}
          accessToken={accessToken}
          onUpdate={handleUpdateAndDelete}
          onDelete={handleUpdateAndDelete}
        />
      ))}
    </div>
  );
};

export default GetMyAmbulanceRequestClient;
