import { NavigationBarClient } from "@/components/navigation/nav-bar-client";
import { AuthState } from "@/core/interface/auth-state.inteface";
import { cookies } from "next/headers";
import React from "react";

const NavigationBarServer = async () => {
  const cookieStore = await cookies();

  // Only consider a token valid if it exists and has a value
  const userToken = cookieStore.get("accessToken")?.value;
  const adminToken = cookieStore.get("adminAccessToken")?.value;
  const ambulanceToken = cookieStore.get("ambulanceAccessToken")?.value;

  // Create auth state based on valid tokens
  const authState: AuthState = {
    isUser: Boolean(userToken),
    isAdmin: Boolean(adminToken),
    isAmbulance: Boolean(ambulanceToken),
  };

  // For debugging purposes
  // console.log("Auth State:", {
  //   userToken: Boolean(userToken),
  //   adminToken: Boolean(adminToken),
  //   ambulanceToken: Boolean(ambulanceToken),
  // });

  return (
    <>
      <NavigationBarClient authState={authState} />
    </>
  );
};

export default NavigationBarServer;
