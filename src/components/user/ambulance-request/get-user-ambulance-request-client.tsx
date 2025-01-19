"use client";

import { UserAmbulanceRequestResponse } from "@/core/types/user/ambulance-request";
import React, { useMemo } from "react";
import { AmbulanceRequestItem } from "./ambulance-request-item";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  requests: UserAmbulanceRequestResponse;
}

const GetUserAmbulanceRequestClient: React.FC<Props> = ({ requests }) => {
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  const filteredRequests = useMemo(() => {
    if (!Array.isArray(requests.data)) return [];

    return statusFilter === "ALL"
      ? requests.data
      : requests.data.filter((request) => request.status === statusFilter);
  }, [requests.data, statusFilter]);

  if (!Array.isArray(requests.data) || requests.data.length === 0) {
    return (
      <Card className="p-6 max-w-2xl mx-auto my-4">
        <p className="text-center text-muted-foreground">
          No ambulance requests found
        </p>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ambulance Requests</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Requests</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <AmbulanceRequestItem key={request._id} data={request} />
        ))}
      </div>

      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredRequests.length} of {requests.data.length} requests
      </div>
    </div>
  );
};

// For better type checking, add Props type assertion
const TypedGetUserAmbulanceRequestClient =
  GetUserAmbulanceRequestClient as React.FC<Props>;

export default TypedGetUserAmbulanceRequestClient;
