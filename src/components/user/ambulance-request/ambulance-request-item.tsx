import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAmbulanceRequest } from "@/core/types/user.interface";

export function AmbulanceRequestItem({ data }: { data: UserAmbulanceRequest }) {
  const statusColor =
    {
      PENDING: "bg-yellow-500",
      ACCEPTED: "bg-green-500",
      REJECTED: "bg-red-500",
      // Add more statuses as needed
    }[data.status] || "bg-gray-500";

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Request ID: {data._id}
          <Badge className={`${statusColor} text-white`}>{data.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <strong>Ambulance:</strong> {data.ambulance}
          </div>
          <div>
            <strong>Requester:</strong> {data.requester}
          </div>
          <div>
            <strong>Created At:</strong>{" "}
            {new Date(data.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Updated At:</strong>{" "}
            {new Date(data.updatedAt).toLocaleString()}
          </div>
          <div className="col-span-2">
            <strong>Hospital Location:</strong>
            <br />
            Latitude: {data.hospital_location.latitude}
            <br />
            Longitude: {data.hospital_location.longitude}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
