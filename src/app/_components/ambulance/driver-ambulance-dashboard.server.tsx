import { getCurrentAmbulanceAccessToken } from "@/app/actions/ambulance/auth/get-current-ambulance-access-token";
import getMyAmbulanceRequests from "@/app/actions/ambulance/requests/get-my-ambulance-requests.action";
import DriverAmbulanceDashboardClient from "@/components/ambulance/driver-ambulance-dashboard.client";
import { Alert } from "@/components/ui/alert";
import {
  AmbulanceRequestResult,
  isSuccessResponse,
} from "@/core/interface/ambulance/request";
import { redirect } from "next/navigation";
import React from "react";
import EmptyState from "./empty-state";

const DriverAmbulanceDashboardServer = async () => {
  const accessToken = await getCurrentAmbulanceAccessToken();

  if (!accessToken) {
    redirect("/ambulance-signin?message=unauthorized");
  }

  const result = await getMyAmbulanceRequests({
    accessToken: accessToken,
  });

  const response = result.data as AmbulanceRequestResult;

  if (!isSuccessResponse(response)) {
    return (
      <Alert variant="destructive">
        {response?.message || "Failed to fetch my requests."}
      </Alert>
    );
  }

  if (
    !response.data ||
    (Array.isArray(response.data) && response.data.length === 0)
  ) {
    return EmptyState();
  }

  return (
    <div>
      <DriverAmbulanceDashboardClient
        accessToken={accessToken}
        requests={response}
      />
    </div>
  );
};

export default DriverAmbulanceDashboardServer;
