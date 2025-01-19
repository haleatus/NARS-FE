export interface HospitalLocation {
  latitude: string;
  longitude: string;
}

export interface UserAmbulanceRequest {
  _id: string;
  ambulance: string;
  requester: string;
  hospital_location: HospitalLocation;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface UserAmbulanceRequestResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: UserAmbulanceRequest;
}

// Error response type
export interface UserAmbulanceRequestError {
  statusCode: number;
  message: string;
  data: null;
}

// Union type for all possible responses
export type UserAmbulanceRequestResult =
  | UserAmbulanceRequestResponse
  | UserAmbulanceRequestError;

// Type guard to check if response is successful
export function isSuccessResponse(
  response: UserAmbulanceRequestResult
): response is UserAmbulanceRequestResponse {
  return response.statusCode === 200 && response.data !== null;
}
