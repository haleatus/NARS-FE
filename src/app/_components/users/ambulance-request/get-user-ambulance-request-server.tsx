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
  <Alert variant="destructive" className="max-w-2xl mx-auto my-4">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const LoadingState = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const GetUserAmbulanceRequest = async () => {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    return (
      <ErrorMessage message="You must be logged in to view ambulance requests" />
    );
  }

  const result = await getUserAmbulanceRequests({
    accessToken: accessToken,
  });

  if (!result || !result.data) {
    return <ErrorMessage message="Failed to fetch ambulance requests" />;
  }

  const response = result.data as UserAmbulanceRequestResult;

  if (!isSuccessResponse(response)) {
    return <ErrorMessage message={response.message || "An error occurred"} />;
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
