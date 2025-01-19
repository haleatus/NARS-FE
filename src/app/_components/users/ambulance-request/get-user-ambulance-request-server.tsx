import getUserAmbulanceRequests from "@/app/actions/user/ambulance-request/get-user-ambulance-requests.action";
import { getCurrentUserAccessToken } from "@/app/actions/user/get-current-user-access-token";
import GetUserAmbulanceRequestClient from "@/components/user/ambulance-request/get-user-ambulance-request-client";
import React from "react";

const GetUserAmbulanceRequest = async () => {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    return (
      <div>
        <h1>Unauthorized</h1>
      </div>
    );
  }

  const ambulanceRequests = await getUserAmbulanceRequests({
    accessToken: accessToken,
  });

  // Handle case where request failed
  if (!ambulanceRequests) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold font-sans text-red-500 flex justify-center items-center">
          Failed to fetch ambulance requests
        </h1>
      </div>
    );
  }

  // Handle case where no data was returned
  if (!ambulanceRequests.data) {
    return (
      <div className="p-4 font-sans flex justify-center items-center">
        <h1 className="text-xl font-bold">No Ambulance Requests Found</h1>
      </div>
    );
  }

  // Check if data array exists and has items
  const requests = ambulanceRequests.data.data;
  const hasRequests = Array.isArray(requests) && requests.length > 0;

  return (
    <div>
      {hasRequests ? (
        <GetUserAmbulanceRequestClient requests={ambulanceRequests.data} />
      ) : (
        <div className="p-4">
          <h1 className="text-xl font-bold">No Ambulance Requests Found</h1>
        </div>
      )}
    </div>
  );
};

export default GetUserAmbulanceRequest;
