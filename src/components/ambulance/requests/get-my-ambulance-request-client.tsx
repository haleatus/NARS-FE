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
      <Card className="p-6 text-center text-muted-foreground bg-white border-none shadow-sm">
        No requests found
      </Card>
    );
  }

  const statusTabs = ["PENDING", "ENROUTE"] as const;

  const filteredRequests = requests.data.filter(
    (request) => request.status === activeTab
  );

  return (
    <div className="w-full space-y-4">
      <Tabs
        defaultValue="PENDING"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-2 mb-4 bg-transparent border rounded-lg p-1">
          {statusTabs.map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className="rounded-md text-sm font-medium py-2 data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all"
            >
              {status === "PENDING" ? "Pending" : "En Route"}
              {requests.data.filter((req) => req.status === status).length >
                0 && (
                <span className="ml-2 bg-gray-200 text-gray-800 data-[state=active]:bg-red-700 data-[state=active]:text-white px-2 py-0.5 rounded-full text-xs">
                  {requests.data.filter((req) => req.status === status).length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {statusTabs.map((status) => (
          <TabsContent key={status} value={status} className="mt-0">
            {filteredRequests.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
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
              <Card className="p-6 text-center text-muted-foreground bg-white border-none shadow-sm">
                No {status.toLowerCase()} requests found
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GetMyAmbulanceRequestClient;
