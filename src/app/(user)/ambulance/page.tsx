import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Ambulance } from "lucide-react";
import { getAllAmbulance } from "@/app/actions/ambulance/get-all-ambulance.action";
import AmbulanceClient from "@/components/ambulance/ambulance-client";
import { getAllHospitalService } from "@/app/services/hospital/hospital.service";
import { getCurrentUserAccessToken } from "@/app/actions/user/auth/get-current-user-access-token";
import getUserAmbulanceRequests from "@/app/actions/user/ambulance-request/get-user-ambulance-requests.action";
import { UserAmbulanceRequestResponse } from "@/core/types/user/ambulance-request";
import { redirect } from "next/navigation";

export default async function AmbulanceDashboard() {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    redirect("/signin?message=unauthorized");
  }

  const ambulanceData = await getAllAmbulance();
  const hospitalData = await getAllHospitalService();

  const myAmbulanceRequest = await getUserAmbulanceRequests({
    accessToken: accessToken,
  });

  const myRequestExists = myAmbulanceRequest?.data ? true : false;

  return (
    <div className="font-lora">
      <div className="container mx-auto p-4 space-y-8">
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Ambulance className="h-6 w-6 text-red-500" />
              Available Ambulances
            </CardTitle>
            <CardDescription>
              Real-time overview of ambulance locations and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AmbulanceClient
              ambulanceData={ambulanceData}
              hospitalData={hospitalData}
              accessToken={accessToken}
              myRequestExists={myRequestExists}
              requests={myAmbulanceRequest.data as UserAmbulanceRequestResponse}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
