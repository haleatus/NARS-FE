import { Admin } from "./admin.interface";
import { Ambulance } from "./ambulance.interface";
import { User } from "./user/user.interface";

export interface AuthSuccessResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: {
    accessToken?: string;
    admin?: Admin;
    user?: User;
    ambulance?: Ambulance;
  };
}

export interface AuthErrorResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: Record<string, never>;
}
