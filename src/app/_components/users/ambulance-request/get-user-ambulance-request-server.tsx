import React, { Suspense } from "react";
import getUserAmbulanceRequests from "@/app/actions/user/ambulance-request/get-user-ambulance-requests.action";
import { getCurrentUserAccessToken } from "@/app/actions/user/get-current-user-access-token";
import GetUserAmbulanceRequestClient from "@/components/user/ambulance-request/get-user-ambulance-request-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  isSuccessResponse,
  UserAmbulanceRequestResult,
} from "@/core/types/user/ambulance-request";

const ErrorMessage = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const LoadingState = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const NoDataState = () => (
  <Alert>
    <AlertTitle>No Requests Found</AlertTitle>
    <AlertDescription>
      You don&apos;t have any ambulance requests yet.
    </AlertDescription>
  </Alert>
);

const GetUserAmbulanceRequest = async () => {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    return <ErrorMessage message="Not authenticated. Please log in." />;
  }

  const result = await getUserAmbulanceRequests({
    accessToken: accessToken,
  });

  // Handle null or undefined result
  if (!result || !result.data) {
    return <NoDataState />;
  }

  const response = result.data as UserAmbulanceRequestResult;

  // Check if response is valid and has data
  if (!isSuccessResponse(response)) {
    return (
      <ErrorMessage
        message={
          response?.message || "An error occurred while fetching requests"
        }
      />
    );
  }

  // If response data is empty array or null
  if (
    !response.data ||
    (Array.isArray(response.data) && response.data.length === 0)
  ) {
    return <NoDataState />;
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <GetUserAmbulanceRequestClient
        requests={response}
        accessToken={accessToken}
      />
    </Suspense>
  );
};

export default GetUserAmbulanceRequest;
