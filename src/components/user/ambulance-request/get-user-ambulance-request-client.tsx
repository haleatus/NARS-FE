"use client";

import { UserAmbulanceRequestResponse } from "@/core/types/user.interface";
import React from "react";
import { AmbulanceRequestItem } from "./ambulance-request-item";

const GetUserAmbulanceRequestClient = ({
  requests,
}: {
  requests: UserAmbulanceRequestResponse;
}) => {
  if (!requests.data || !Array.isArray(requests.data)) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">No requests available</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ambulance Requests</h1>
      {requests.data.map((request) => (
        <AmbulanceRequestItem key={request._id} data={request} />
      ))}
    </div>
  );
};

export default GetUserAmbulanceRequestClient;
