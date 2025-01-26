import GetAmbulanceByIdServer from "@/app/_components/ambulance/get-ambulance-by-id-server";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const SpecificAmbulancePage = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <GetAmbulanceByIdServer id={id} />
    </div>
  );
};

export default SpecificAmbulancePage;
