// import { Ambulance } from "../ambulance.interface";
import { User } from "./user.interface";

export interface HospitalLocation {
  latitude: string;
  longitude: string;
}

export interface UserAmbulanceRequest {
  createdAt: string;
  updatedAt: string;
  _id: string;
  // ambulance: Ambulance;
  ambulance: string;
  requester: User;
  hospital_location: HospitalLocation;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
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
  timestamp: string;
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
