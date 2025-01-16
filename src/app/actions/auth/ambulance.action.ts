"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import {
  AuthErrorResponse,
  AuthSuccessResponse,
} from "@/core/types/auth.interface";
import { signInAmbulanceSchema } from "@/app/schema/ambulance";
import { signInAmbulanceService } from "@/app/services/auth/ambulance-auth.service";

export async function ambulanceSignIn(
  formData: z.infer<typeof signInAmbulanceSchema>
): Promise<{
  success: boolean;
  data?: AuthSuccessResponse;
  error?: AuthErrorResponse;
}> {
  try {
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
      if (response.data && response.data.user) {
        cookiesStore.set(
          "ambulanceData",
          JSON.stringify({
            _id: response.data.user._id,
            fullname: response.data.user.fullname,
            email: response.data.user.email,
            contact: response.data.user.contact,
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
