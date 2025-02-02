import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GetMyAmbulanceRequestServer from "@/app/_components/ambulance/requests/get-my-ambulance-request-server";
import MapView from "@/components/map/map-view";

export default function DriverDashboard() {
  return (
    <div className="container mx-auto p-2 space-y-4 font-lora">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Driver Dashboard</h1>
        <Badge variant="outline">Status: Available</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative flex justify-between items-center gap-2 h-[450px]">
            <MapView className="h-full w-1/2 rounded-md overflow-hidden" />
            <div className="w-1/2 h-full rounded-md bg-background">
              <GetMyAmbulanceRequestServer />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
