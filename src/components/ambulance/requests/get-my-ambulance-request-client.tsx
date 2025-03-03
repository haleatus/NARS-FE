"use client";

import type React from "react";
import { useState } from "react";
import { RequestItem } from "./request-item";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import type {
  AmbulanceRequest,
  AmbulanceRequestResponse,
} from "@/core/interface/ambulance/request";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  requests: AmbulanceRequestResponse;
  accessToken: string;
  onNavigate?: (request: AmbulanceRequest) => void;
}

const GetMyAmbulanceRequestClient: React.FC<Props> = ({
  requests,
  accessToken,
  onNavigate,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("PENDING");

  const handleUpdateAndDelete = () => {
    router.refresh();
  };

  if (!requests.data || requests.data.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No requests found
      </Card>
    );
  }

  const statusTabs = ["PENDING", "ENROUTE"] as const;

  const filteredRequests = requests.data.filter(
    (request) => request.status === activeTab
  );

  return (
    <Tabs
      defaultValue="PENDING"
      onValueChange={setActiveTab}
      className="w-full p-2"
    >
      <TabsList className="grid w-full grid-cols-3 bg-gray-100">
        {statusTabs.map((status) => (
          <TabsTrigger
            key={status}
            value={status}
            className="text-sm data-[state=active]:bg-[#FF0000] data-[state=active]:text-white"
          >
            {status}
          </TabsTrigger>
        ))}
      </TabsList>
      {statusTabs.map((status) => (
        <TabsContent key={status} value={status}>
          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 pt-0">
              {filteredRequests.map((request) => (
                <RequestItem
                  key={request._id}
                  data={request}
                  accessToken={accessToken}
                  onUpdate={handleUpdateAndDelete}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ) : (
            <Card className="p-4 text-center text-muted-foreground">
              No {status.toLowerCase()} requests found
            </Card>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default GetMyAmbulanceRequestClient;
