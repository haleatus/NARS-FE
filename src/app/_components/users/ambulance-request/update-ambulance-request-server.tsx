import { getCurrentUserAccessToken } from "@/app/actions/user/get-current-user-access-token";
import UpdateAmbulanceRequestClient from "@/components/user/ambulance-request/update-ambuance-request-client";

export default async function UpdateAmbulanceRequestServer({
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
      <UpdateAmbulanceRequestClient id={id} accessToken={accessToken} />
    </div>
  );
}
