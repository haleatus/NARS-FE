import { Ambulance } from "../ambulance.interface";
import { HospitalLocation } from "../user/ambulance-request";
import { User } from "../user/user.interface";

export interface AmbulanceRequest {
  createdAt: string;
  updatedAt: string;
  _id: string;
  ambulance: Ambulance;
  requester: User;
  hospital_location: HospitalLocation;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

export interface AmbulanceRequestResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: AmbulanceRequest[];
}

// Error response type
export interface AmbulanceRequestError {
  statusCode: number;
  message: string;
  data: null;
}

// Union type for all possible responses
export type AmbulanceRequestResult =
  | AmbulanceRequestResponse
  | AmbulanceRequestError;

// Type guard to check if response is successful
export function isSuccessResponse(
  response: AmbulanceRequestResult
): response is AmbulanceRequestResponse {
  return response.statusCode === 200 && response.data !== null;
}
