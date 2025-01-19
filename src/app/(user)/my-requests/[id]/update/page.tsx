import UpdateAmbulanceRequestServer from "@/app/_components/users/ambulance-request/update-ambulance-request-server";

interface UpdateAmbulanceRequestPageProps {
  params: Promise<{ id: string }>; // request ID from the URL
}

export default async function CreateAmbulanceRequestPage({
  params,
}: UpdateAmbulanceRequestPageProps) {
  const { id } = await params;
  return <UpdateAmbulanceRequestServer id={id} />;
}
