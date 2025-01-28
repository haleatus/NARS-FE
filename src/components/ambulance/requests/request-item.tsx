"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, User, Ambulance } from "lucide-react";
import { format } from "date-fns";
import { AmbulanceRequest } from "@/core/types/ambulance/request";
import updateMyAmbulanceRequestStatus from "@/app/actions/ambulance/requests/update-my-ambulance-request-status.action";
import { toast } from "sonner";

interface RequestItemProps {
  data: AmbulanceRequest;
  accessToken: string;
  onUpdate?: () => void;
}

export const RequestItem: React.FC<RequestItemProps> = ({
  data,
  accessToken,
  onUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(data.status);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusConfig = {
    PENDING: {
      color: "bg-yellow-500 hover:bg-yellow-600",
      icon: "🕒",
    },
    COMPLETED: {
      color: "bg-green-500 hover:bg-green-600",
      icon: "✅",
    },
    CANCELLED: {
      color: "bg-red-500 hover:bg-red-600",
      icon: "❌",
    },
    ENROUTE: {
      color: "bg-blue-500 hover:bg-blue-600",
      icon: "🚑",
    },
  } as const;

  const statusStyle = statusConfig[data.status] || {
    color: "bg-gray-500 hover:bg-gray-600",
    icon: "❓",
  };

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    const result = await updateMyAmbulanceRequestStatus({
      accessToken,
      status: selectedStatus,
      requestID: data._id,
    });

    console.log("result", result);

    setIsUpdating(false);
    setIsDialogOpen(false);

    if (result.error) {
      toast.error(`Failed to update status: ${result.error}`);
    } else {
      onUpdate?.();
      toast.success("Status updated successfully.");
    }
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300 font-work-sans">
      <CardHeader className="p-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-md font-bold">
              Request #{data._id.slice(-6)}
            </CardTitle>
            <p className="text-sm flex items-center text-muted-foreground">
              <User className="inline-block w-4 h-4 mr-1" />
              {data.requester.fullname}
            </p>
          </div>
          <Badge className={`${statusStyle.color} text-white px-3 py-1`}>
            {statusStyle.icon} {data.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 pb-2 font-sans">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Ambulance className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Ambulance ID</p>
              <p className="text-sm text-muted-foreground">
                {data.ambulance._id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-sm font-medium">Hospital Location</p>
              <p className="text-sm text-muted-foreground">
                {data.hospital_location.latitude},{" "}
                {data.hospital_location.longitude}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(data.createdAt), "PPp")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(data.updatedAt), "PPp")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <select
            className="border p-2 rounded-md w-full"
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(
                e.target.value as
                  | "PENDING"
                  | "ENROUTE"
                  | "COMPLETED"
                  | "CANCELLED"
              )
            }
          >
            {Object.keys(statusConfig).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-blue-500 text-white"
              >
                Change Status
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to change the status to &quot;
                  {selectedStatus}&quot;?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
