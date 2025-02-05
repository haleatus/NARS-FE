import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Ambulance, LogIn } from "lucide-react";
import { getAllAmbulance } from "@/app/actions/ambulance/get-all-ambulance.action";
import AmbulanceClient from "@/components/ambulance/ambulance-client";
import { getAllHospitalService } from "@/app/services/hospital/hospital.service";
import { getCurrentUserAccessToken } from "@/app/actions/user/auth/get-current-user-access-token";
import getUserAmbulanceRequests from "@/app/actions/user/ambulance-request/get-user-ambulance-requests.action";
import { UserAmbulanceRequestResponse } from "@/core/types/user/ambulance-request";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AmbulanceDashboard() {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    return (
      <div className="font-lora">
        <div className="container mx-auto p-4 space-y-8">
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Ambulance className="h-6 w-6 text-red-500" />
                To View Available Ambulances
              </CardTitle>
              <CardDescription>
                Real-time overview of ambulance locations and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 font-mono">
                Please sign in to view available ambulances and request
                emergency services.
              </p>
              <div className="flex justify-center">
                <Button asChild className="w-full max-w-xs hover:bg-red-500">
                  <Link
                    href="/signin"
                    className="flex items-center justify-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
