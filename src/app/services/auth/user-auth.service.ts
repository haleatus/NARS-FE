/* eslint-disable @typescript-eslint/no-explicit-any */
import { createUserSchema, signInUserSchema } from "@/app/schema/user/user";
import { endpoints } from "@/core/contants/endpoints";
import { AuthErrorResponse } from "@/core/types/auth.interface";
import { z } from "zod";

export const createUserService = async (
  data: z.infer<typeof createUserSchema>
) => {
  const res = await fetch(endpoints.auth.user.signup, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const newUser: AuthErrorResponse = await res.json();

  if (!res.ok) {
    // Create a structured error object that includes both the message and specific field errors
    const error = new Error(newUser.message);
    (error as any).fieldErrors = newUser.message;
    throw error;
  }

  return newUser;
};

export const signInUserService = async (
  data: z.infer<typeof signInUserSchema>
) => {
  const res = await fetch(endpoints.auth.user.signin, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const user: AuthErrorResponse = await res.json();

  if (!res.ok) {
    const error = new Error(user.message);
    (error as any).fieldErrors = user.message;
    throw error;
  }

  return user;
};
