"use client";

import { UserAmbulanceRequestResponse } from "@/core/interface/user/ambulance-request";
import React from "react";
import { AmbulanceRequestItem } from "../ambulance-request-item";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

interface Props {
  requests: UserAmbulanceRequestResponse;
  accessToken: string;
}

const GetUserAmbulanceRequestClientV3: React.FC<Props> = ({
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

  const handleNavigate = () => {
    // Show rthe route
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
        onClick={() => handleNavigate()}
      >
        <Navigation size={16} />
        Navigate
      </Button>
    </div>
  );
};

export default GetUserAmbulanceRequestClientV3;
