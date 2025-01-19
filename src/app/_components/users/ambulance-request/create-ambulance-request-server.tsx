import { getCurrentUserAccessToken } from "@/app/actions/user/get-current-user-access-token";
import CreateAmbulanceRequestClient from "@/components/user/ambulance-request/create-ambuance-request-client";

export default async function CreateAmbulanceRequestServer({
  id,
}: {
  id: string;
}) {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    return (
      <div>
        <p>Unauthorized</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <CreateAmbulanceRequestClient id={id} accessToken={accessToken} />
    </div>
  );
}
