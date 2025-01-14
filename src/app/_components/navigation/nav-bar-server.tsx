import { getCurrentUser } from "@/app/actions/user/get-current-user.action";
import { NavigationBarClient } from "@/components/navigation/nav-bar-client";
import React from "react";

const NavigationBarServer = async () => {
  const user = await getCurrentUser();
  return (
    <>
      <NavigationBarClient user={user} />
    </>
  );
};

export default NavigationBarServer;
