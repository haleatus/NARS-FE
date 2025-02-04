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

export default async function AmbulanceDashboard() {
  const ambulanceData = await getAllAmbulance();
  const hospitalData = await getAllHospitalService();
  const accessToken = (await getCurrentUserAccessToken()) ?? "";

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
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
