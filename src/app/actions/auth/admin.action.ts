"use server";

import { createAdminSchema, signInAdminSchema } from "@/app/schema/admin";
import {
  createAdminService,
  signInAdminService,
} from "@/app/services/auth/admin-auth.service";
import {
  AuthErrorResponse,
  AuthSuccessResponse,
} from "@/core/interface/auth.interface";
import { cookies } from "next/headers";
import { z } from "zod";

export async function adminSignUp(
  formData: z.infer<typeof createAdminSchema>
): Promise<{
  success: boolean;
  data?: AuthSuccessResponse;
  error?: AuthErrorResponse;
}> {
  try {
    // Validate the input data
    const validatedData = createAdminSchema.parse(formData);

    // Call the service
    const response = await createAdminService(validatedData);

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
          statusCode: 409,
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

export async function adminSignIn(
  formData: z.infer<typeof signInAdminSchema>
): Promise<{
  success: boolean;
  data?: AuthSuccessResponse;
  error?: AuthErrorResponse;
}> {
  try {
    // Delete the existing access token and user data cookies to login as admin
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("userData");
    cookieStore.delete("ambulanceAccessToken");
    cookieStore.delete("ambulanceData");

    // Validate the input data
    const validatedData = signInAdminSchema.parse(formData);

    // Call the service
    const response = (await signInAdminService(
      validatedData
    )) as AuthSuccessResponse;

    // Set the access token in an HTTP-only cookie
    if ("data" in response && response.data.accessToken) {
      const cookiesStore = await cookies();

      // Set access token cookie
      cookiesStore.set("adminAccessToken", response.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      // Set user data cookie
      if (response.data.admin) {
        cookiesStore.set(
          "adminData",
          JSON.stringify({
            _id: response.data.admin._id,
            username: response.data.admin.username,
            email: response.data.admin.email,
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

export async function adminSignOut(): Promise<{
  success: boolean;
  error?: {
    message: string;
  };
}> {
  try {
    const cookiesStore = await cookies();

    // Remove both cookies by setting their maxAge to 0
    cookiesStore.delete("adminAccessToken");
    cookiesStore.delete("adminData");

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
