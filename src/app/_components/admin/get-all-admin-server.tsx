import { getCurrentAdminAccessToken } from "@/app/actions/admin/auth/get-current-admin-access-token";
import getAllAdmin from "@/app/actions/admin/get-all-admin.action";
import GetAllAdminClient from "@/components/admin/get-all-admin-client";
import React from "react";

const GetAllAdminServer = async () => {
  const accessToken = await getCurrentAdminAccessToken();

  if (!accessToken) {
    return (
      <div>
        <h1>Unauthorized</h1>
      </div>
    );
  }

  const adminData = await getAllAdmin({ accessToken });

  if (!adminData) {
    return (
      <div>
        <h1>Failed to fetch</h1>
      </div>
    );
  }

  return (
    <div>
      {adminData.data.length > 0 ? (
        <GetAllAdminClient adminsData={adminData.data} />
      ) : (
        <div>No Admin Users Found</div>
      )}
    </div>
  );
};

export default GetAllAdminServer;
