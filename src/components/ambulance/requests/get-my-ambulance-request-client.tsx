"use client";

import type React from "react";
import { useState } from "react";
import { RequestItem } from "./request-item";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import type { AmbulanceRequestResponse } from "@/core/types/ambulance/request";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  requests: AmbulanceRequestResponse;
  accessToken: string;
}

const GetMyAmbulanceRequestClient: React.FC<Props> = ({
  requests,
  accessToken,
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

  const statusTabs = ["PENDING", "ENROUTE", "CANCELLED", "COMPLETED"] as const;

  const filteredRequests = requests.data.filter(
    (request) => request.status === activeTab
  );

  return (
    <Tabs
      defaultValue="PENDING"
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4 bg-gray-100">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {filteredRequests.map((request) => (
                <RequestItem
                  key={request._id}
                  data={request}
                  accessToken={accessToken}
                  onUpdate={handleUpdateAndDelete}
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
