"use client";

import React from "react";
import { redirect } from "next/navigation";
import { UpdateAmbulanceRequestForm } from "./update-ambulance-request-form";

const UpdateAmbulanceRequestClient = ({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) => {
  return (
    <div>
      <UpdateAmbulanceRequestForm
        requestId={id}
        accessToken={accessToken}
        onSuccess={() => {
          // Redirect to ambulance requests list or show success message
          redirect("/my-requests");
        }}
        onCancel={() => {
          if (window.history.length > 1) {
            // Go back if history exists
            window.history.back();
          } else {
            // Redirect to a safe fallback
            redirect("/my-requests");
          }
        }}
      />
    </div>
  );
};

export default UpdateAmbulanceRequestClient;
