export interface User {
  _id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  fullname: string;
  email: string;
  contact: string;
  deletedAt: string | Date | null;
}

export interface UserAmbulanceRequest {
  _id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  ambulance: string;
  requester: string;
  hospital_location: {
    latitude: string;
    longitude: string;
  };
  status: string;
}

export interface UserAmbulanceRequestResponse {
  statusCode?: number;
  timestamp?: string;
  message?: string;
  data?: UserAmbulanceRequest[];
}
