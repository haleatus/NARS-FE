import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GetMyAmbulanceRequestServer from "@/app/_components/ambulance/requests/get-my-ambulance-request-server";
import MapView from "@/components/map/map-view";

export default function DriverDashboard() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Driver Dashboard</h1>
        <Badge variant="outline">Status: Available</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Location & Route</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center gap-2">
            <MapView className="h-[400px] w-1/2 rounded-md overflow-hidden" />
            <div className="w-1/2 h-[400px] rounded-md bg-background">
              <GetMyAmbulanceRequestServer />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Emergency Location
              </p>
              <p className="font-medium">No active emergency</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">ETA</p>
              <p className="font-medium">-</p>
            </div>
            <Button className="w-full" disabled>
              Accept Emergency
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Responses Completed
                </span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Average Response Time
                </span>
                <span className="font-medium">7.2 mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distance Covered</span>
                <span className="font-medium">42 km</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
