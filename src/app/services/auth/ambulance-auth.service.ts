/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInAmbulanceSchema } from "@/app/schema/ambulance/ambulance";
import { endpoints } from "@/core/contants/endpoints";
import { AuthErrorResponse } from "@/core/types/auth.interface";
import { z } from "zod";

export const signInAmbulanceService = async (
  data: z.infer<typeof signInAmbulanceSchema>
) => {
  const res = await fetch(endpoints.auth.ambulance.signin, {
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
