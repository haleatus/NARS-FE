/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdminSchema, signInAdminSchema } from "@/app/schema/admin";
import { endpoints } from "@/core/contants/endpoints";
import { AuthErrorResponse } from "@/core/types/auth.interface";
import { z } from "zod";

export const createAdminService = async (
  data: z.infer<typeof createAdminSchema>
) => {
  const res = await fetch(endpoints.auth.admin.signup, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const newAdmin: AuthErrorResponse = await res.json();

  if (!res.ok) {
    // Create a structured error object that includes both the message and specific field errors
    const error = new Error(newAdmin.message);
    (error as any).fieldErrors = newAdmin.message;
    throw error;
  }

  return newAdmin;
};

export const signInAdminService = async (
  data: z.infer<typeof signInAdminSchema>
) => {
  const res = await fetch(endpoints.auth.admin.signin, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const admin: AuthErrorResponse = await res.json();

  if (!res.ok) {
    const error = new Error(admin.message);
    (error as any).fieldErrors = admin.message;
    throw error;
  }

  return admin;
};
