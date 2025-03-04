import { getCurrentUserAccessToken } from "@/app/actions/user/auth/get-current-user-access-token";
import ProfileClient from "@/components/user/profile/profile-client";
import { redirect } from "next/navigation";
import React from "react";

const ProfileServer = async () => {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    redirect("/signin");
  }

  return (
    <div>
      <ProfileClient accessToken={accessToken} />
    </div>
  );
};

export default ProfileServer;
