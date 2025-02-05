"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import {
  AuthErrorResponse,
  AuthSuccessResponse,
} from "@/core/interface/auth.interface";
import { signInAmbulanceService } from "@/app/services/auth/ambulance-auth.service";
import { signInAmbulanceSchema } from "@/app/schema/ambulance/ambulance";

export async function ambulanceSignIn(
  formData: z.infer<typeof signInAmbulanceSchema>
): Promise<{
  success: boolean;
  data?: AuthSuccessResponse;
  error?: AuthErrorResponse;
}> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("userData");
    cookieStore.delete("adminAccessToken");
    cookieStore.delete("adminData");

    // Validate the input data
    const validatedData = signInAmbulanceSchema.parse(formData);

    // Call the service
    const response = (await signInAmbulanceService(
      validatedData
    )) as AuthSuccessResponse;

    // Set the access token in an HTTP-only cookie
    if ("data" in response && response.data.accessToken) {
      const cookiesStore = await cookies();

      // Set access token cookie
      cookiesStore.set("ambulanceAccessToken", response.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      // Set user data cookie
      if (response.data && response.data.ambulance) {
        cookiesStore.set(
          "ambulanceData",
          JSON.stringify({
            _id: response.data.ambulance._id,
            driver_name: response.data.ambulance.driver_name,
            ambulance_number: response.data.ambulance.ambulance_number,
            contact: response.data.ambulance.contact,
            location: {
              latitude: response.data.ambulance.location.latitude,
              longitude: response.data.ambulance.location.longitude,
            },
            status: response.data.ambulance.status,
          }),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 days
          }
        );
      }
    }

    return {
      success: true,
      data: response as AuthSuccessResponse,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          statusCode: 400,
          timestamp: new Date().toISOString(),
          message: error.errors.map((e) => `${e.message}`).join(", "),
          data: {},
        },
      };
    }

    // Handle service errors
    if (error instanceof Error && "fieldErrors" in error) {
      return {
        success: false,
        error: {
          statusCode: 400,
          timestamp: new Date().toISOString(),
          message: error.message,
          data: {},
        },
      };
    }

    // Handle unexpected errors
    return {
      success: false,
      error: {
        statusCode: 500,
        timestamp: new Date().toISOString(),
        message: "An unexpected error occurred",
        data: {},
      },
    };
  }
}

export async function ambulanceSignOut(): Promise<{
  success: boolean;
  error?: {
    message: string;
  };
}> {
  try {
    const cookiesStore = await cookies();

    // Remove both cookies by setting their maxAge to 0
    cookiesStore.delete("ambulanceAccessToken");
    cookiesStore.delete("ambulanceData");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to sign out", error);
    return {
      success: false,
      error: {
        message: "Failed to sign out",
      },
    };
  }
}
