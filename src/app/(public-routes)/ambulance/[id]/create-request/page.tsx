import CreateAmbulanceRequestServer from "@/app/_components/users/ambulance-request/create-ambulance-request-server";

interface CreateAmbulanceRequestPageProps {
  params: Promise<{ id: string }>; // ambulance ID from the URL
}

export default async function CreateAmbulanceRequestPage({
  params,
}: CreateAmbulanceRequestPageProps) {
  const { id } = await params;
  return <CreateAmbulanceRequestServer id={id} />;
}
