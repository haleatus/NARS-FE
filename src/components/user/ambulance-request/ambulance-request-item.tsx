import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAmbulanceRequest } from "@/core/types/user/ambulance-request";
import UpdateRequestDialog from "./update-requests-dialog";

interface AmbulanceRequestItemProps {
  data: UserAmbulanceRequest;
  accessToken: string;
  onUpdate?: () => void;
}

export const AmbulanceRequestItem: React.FC<AmbulanceRequestItemProps> = ({
  data,
  accessToken,
  onUpdate,
}) => {
  const statusStyles = {
    PENDING: "bg-yellow-500 hover:bg-yellow-600",
    ACCEPTED: "bg-green-500 hover:bg-green-600",
    REJECTED: "bg-red-500 hover:bg-red-600",
  } as const;

  const statusStyle =
    statusStyles[data.status] || "bg-gray-500 hover:bg-gray-600";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-lg">
          <span className="font-medium">Request #{data._id.slice(-6)}</span>
          <Badge className={`${statusStyle} text-white`}>{data.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="font-medium">Ambulance ID:</span>
            <p className="text-muted-foreground">{data.ambulance}</p>
          </div>
          <div>
            <span className="font-medium">Requester ID:</span>
            <p className="text-muted-foreground">{data.requester}</p>
          </div>
          <div>
            <span className="font-medium">Created:</span>
            <p className="text-muted-foreground">
              {formatDate(data.createdAt)}
            </p>
          </div>
          <div>
            <span className="font-medium">Last Updated:</span>
            <p className="text-muted-foreground">
              {formatDate(data.updatedAt)}
            </p>
          </div>
        </div>
        <div className="pt-2 border-t">
          <span className="font-medium">Hospital Location:</span>
          <p className="text-muted-foreground text-sm">
            Lat: {data.hospital_location.latitude}, Long:{" "}
            {data.hospital_location.longitude}
          </p>
        </div>
        <div className="pt-2">
          <UpdateRequestDialog
            requestId={data._id}
            accessToken={accessToken}
            ambulanceId={data.ambulance}
            initialData={{
              hospital_location: data.hospital_location,
            }}
            onSuccess={onUpdate}
          />
        </div>
      </CardContent>
    </Card>
  );
};
