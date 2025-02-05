/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAmbulanceRequest } from "@/core/interface/user/ambulance-request";
// import UpdateRequestDialog from "./update-requests-dialog";
import { toast } from "sonner";
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
import { MapPin, User, Ambulance, X, PhoneCall, UserCog2 } from "lucide-react";
import deleteUserAmbulanceRequests from "@/app/actions/user/ambulance-request/delete-ambulance-request.action";

interface AmbulanceRequestItemProps {
  data: UserAmbulanceRequest;
  accessToken: string;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const AmbulanceRequestItem: React.FC<AmbulanceRequestItemProps> = ({
  data,
  accessToken,
  onUpdate,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const statusConfig = {
    PENDING: {
      color: "bg-yellow-500 hover:bg-yellow-600",
      icon: "🕒",
    },
    ACCEPTED: {
      color: "bg-green-500 hover:bg-green-600",
      icon: "✅",
    },
    REJECTED: {
      color: "bg-red-500 hover:bg-red-600",
      icon: "❌",
    },
  } as const;

  const statusStyle = statusConfig[data.status] || {
    color: "bg-gray-500 hover:bg-gray-600",
    icon: "❓",
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteUserAmbulanceRequests({
        accessToken,
        requestId: data._id,
      });

      if (!response) {
        throw new Error("Failed to delete request");
      }

      toast.success("Ambulance request deleted successfully");
      onDelete?.();
    } catch (error) {
      toast.error("Failed to delete ambulance request");
    } finally {
      setIsDeleting(false);
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
              <p className="text-sm font-medium">Ambulance Plate</p>
              <p className="text-sm text-muted-foreground">
                {data.ambulance.ambulance_number}
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
            <PhoneCall className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">Contact</p>
              <p className="text-sm text-muted-foreground">
                {data.ambulance.contact}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UserCog2 className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-sm font-medium">Driver Name</p>
              <p className="text-sm text-muted-foreground">
                {data.ambulance.driver_name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 font-sans">
          {/* <UpdateRequestDialog
            requestId={data._id}
            accessToken={accessToken}
            ambulanceId={data.ambulance}
            initialData={{
              hospital_location: data.hospital_location,
            }}
            onSuccess={() => {
              onUpdate?.();
            }}
          >
            <Button
              variant="outline"
              size="sm"
              className="flex gap-2 items-center"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </UpdateRequestDialog> */}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex gap-2 items-center"
                disabled={isDeleting}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="font-sans">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Ambulance Request</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this ambulance request? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Sure
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
