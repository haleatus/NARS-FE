import React, { Suspense } from "react";
import { Alert } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { getCurrentAmbulanceAccessToken } from "@/app/actions/ambulance/auth/get-current-ambulance-access-token";
import getMyAmbulanceRequests from "@/app/actions/ambulance/requests/get-my-ambulance-requests.action";
import {
  AmbulanceRequestResult,
  isSuccessResponse,
} from "@/core/types/ambulance/request";
import GetMyAmbulanceRequestClient from "@/components/ambulance/requests/get-my-ambulance-request-client";

const GetMyAmbulanceRequest = async () => {
  const accessToken = await getCurrentAmbulanceAccessToken();

  if (!accessToken) {
    return (
      <Alert variant="destructive">Please log in to view your requests.</Alert>
    );
  }

  const result = await getMyAmbulanceRequests({
    accessToken: accessToken,
  });

  if (!result?.data) {
    return <Alert>No ambulance requests found.</Alert>;
  }

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
    return <Alert>You have 0 ambulance requests yet.</Alert>;
  }

  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
      <GetMyAmbulanceRequestClient
        requests={response}
        accessToken={accessToken}
      />
    </Suspense>
  );
};

export default GetMyAmbulanceRequest;
