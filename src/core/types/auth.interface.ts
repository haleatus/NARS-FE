import { Admin } from "./admin.interface";
import { User } from "./user.interface";

export interface AuthSuccessResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: {
    accessToken?: string;
    admin?: Admin;
    user?: User;
  };
}

export interface AuthErrorResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: Record<string, never>;
}
