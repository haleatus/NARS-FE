import GetAmbulanceRequestByIdServer from "@/app/_components/admin/ambulance-request/get-ambulance-request-by-id-server";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const SpecificAmbulanceRequestPage = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <GetAmbulanceRequestByIdServer id={id} />
    </div>
  );
};

export default SpecificAmbulanceRequestPage;
