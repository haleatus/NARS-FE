"use client";

import React from "react";
import { CreateAmbulanceForm } from "./create-ambulance-admin-form";

import { useRouter } from "next/navigation";
import { UpdateAmbulanceForm } from "./update-ambulance-admin-form";

const UpdateAmbulanceClient = ({
  adminAccessToken,
  ambulanceId,
}: {
  adminAccessToken: string;
  ambulanceId: string;
}) => {
  const router = useRouter();
  return (
    <div>
      <UpdateAmbulanceForm
        adminAccessToken={adminAccessToken}
        ambulanceId={ambulanceId}
        onSuccess={() => {
          router.push("/dashboard/ambulance");
        }}
        onCancel={() => {
          if (window.history.length > 1) {
            // Go back if history exists
            window.history.back();
          } else {
            // Redirect to a safe fallback
            router.push("/dashboard/ambulance");
          }
        }}
      />
    </div>
  );
};

export default UpdateAmbulanceClient;
