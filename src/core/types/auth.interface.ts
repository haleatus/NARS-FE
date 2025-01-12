import { Admin } from "./admin.interface";

export interface AuthSuccessResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: {
    accessToken?: string;
    admin?: Admin;
  };
}

export interface AuthErrorResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: Record<string, never>;
}
