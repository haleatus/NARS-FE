import React, { Suspense } from "react";
import getUserAmbulanceRequests from "@/app/actions/user/ambulance-request/get-user-ambulance-requests.action";
import { getCurrentUserAccessToken } from "@/app/actions/user/auth/get-current-user-access-token";
import GetUserAmbulanceRequestClient from "@/components/user/ambulance-request/get-user-ambulance-request-client";
import { Alert } from "@/components/ui/alert";
import {
  isSuccessResponse,
  UserAmbulanceRequestResult,
} from "@/core/types/user/ambulance-request";
import { Loader2 } from "lucide-react";

const GetUserAmbulanceRequest = async () => {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    return (
      <Alert variant="destructive">Please log in to view your requests.</Alert>
    );
  }

  const result = await getUserAmbulanceRequests({
    accessToken: accessToken,
  });

  if (!result?.data) {
    return <Alert>No ambulance requests found.</Alert>;
  }

  const response = result.data as UserAmbulanceRequestResult;

  if (!isSuccessResponse(response)) {
    return (
      <Alert variant="destructive">
        {response?.message || "Failed to fetch requests."}
      </Alert>
    );
  }

  if (
    !response.data ||
    (Array.isArray(response.data) && response.data.length === 0)
  ) {
    return <Alert>You don&apos;t have any ambulance requests yet.</Alert>;
  }

  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
      <GetUserAmbulanceRequestClient
        requests={response}
        accessToken={accessToken}
      />
    </Suspense>
  );
};

export default GetUserAmbulanceRequest;
