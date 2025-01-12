"use server";

import { createAdminSchema } from "@/app/schema/admin";
import { createAdminService } from "@/app/services/auth/admin-auth.service";
import {
  AuthErrorResponse,
  AuthSuccessResponse,
} from "@/core/types/auth.interface";
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
