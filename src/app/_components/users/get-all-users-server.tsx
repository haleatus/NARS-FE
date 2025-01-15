import { getCurrentAdminAccessToken } from "@/app/actions/admin/get-current-admin-access-token";
import getAllUsers from "@/app/actions/user/get-all-users.action";
import GetAllUsersClient from "@/components/user/get-all-user-client";
import React from "react";

const GetAllUsersServer = async () => {
  const accessToken = await getCurrentAdminAccessToken();

  if (!accessToken) {
    return (
      <div>
        <h1>Unauthorized</h1>
      </div>
    );
  }

  const usersData = await getAllUsers({ accessToken });

  if (!usersData) {
    return (
      <div>
        <h1>Failed to fetch</h1>
      </div>
    );
  }

  return (
    <div>
      {usersData.data.length > 0 ? (
        <GetAllUsersClient usersData={usersData.data} />
      ) : (
        <div>No Users Found</div>
      )}
    </div>
  );
};

export default GetAllUsersServer;
