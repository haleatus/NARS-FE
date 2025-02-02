"use client";

import React from "react";
import { CreateAmbulanceForm } from "./create-ambulance-admin-form";

import { useRouter } from "next/navigation";

const CreateAmbulanceClient = ({
  adminAccessToken,
}: {
  adminAccessToken: string;
}) => {
  const router = useRouter();
  return (
    <div>
      <CreateAmbulanceForm
        adminAccessToken={adminAccessToken}
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

export default CreateAmbulanceClient;
