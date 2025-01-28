"use client";

import React from "react";
import { CreateAmbulanceRequestForm } from "./create-ambulance-request-form";
import { useRouter } from "next/navigation";

const CreateAmbulanceRequestClient = ({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) => {
  const router = useRouter();
  return (
    <div>
      <CreateAmbulanceRequestForm
        ambulanceId={id}
        accessToken={accessToken}
        onSuccess={() => {
          // Redirect to ambulance requests list or show success message
          router.push("/my-requests");
        }}
        onCancel={() => {
          if (window.history.length > 1) {
            // Go back if history exists
            window.history.back();
          } else {
            // Redirect to a safe fallback
            router.push("/ambulance");
          }
        }}
      />
    </div>
  );
};

export default CreateAmbulanceRequestClient;
