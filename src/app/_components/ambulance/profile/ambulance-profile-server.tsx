import AmbulanceProfileClient from "@/components/ambulance/profile/ambulance-profile-client";
import React from "react";

const AmbulanceProfileServer = async () => {
  console.log("-----ajsjgbclj--");
  console.log("-----ajsjgbclj--", process.env.BACKEND_BASE_URL);
  console.log("-----ajsjgbclj--");
  return (
    <div>
      <AmbulanceProfileClient />
    </div>
  );
};

export default AmbulanceProfileServer;
