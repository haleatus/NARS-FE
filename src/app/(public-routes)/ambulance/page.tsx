import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Ambulance, MapPin } from "lucide-react";
import UserMapView from "@/components/map/user-map-view";
import { getAllAmbulance } from "@/app/actions/ambulance/get-all-ambulance.action";
import GetAllAmbulanceClient from "@/components/ambulance/get-all-ambulance-client";

export default async function AmbulanceDashboard() {
  const ambulanceData = await getAllAmbulance();

  return (
    <div className="font-lora">
      <div className="container  mx-auto p-4 space-y-8">
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
            <div className="grid md:grid-cols-2 gap-6 h-[440px]">
              <div className="relative rounded-lg overflow-hidden shadow-inner">
                {ambulanceData ? (
                  <UserMapView
                    className="h-full w-full"
                    ambulanceData={ambulanceData}
                    initialZoom={12}
                  />
                ) : (
                  <div>No ambulance data found</div>
                )}
                <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-md p-2 shadow">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Current Locations
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-inner overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Ambulance List
                  </h3>
                </div>
                <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
                  {ambulanceData ? (
                    <GetAllAmbulanceClient ambulanceData={ambulanceData} />
                  ) : (
                    <div>No ambulance data found</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
