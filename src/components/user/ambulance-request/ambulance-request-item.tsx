/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAmbulanceRequest } from "@/core/types/user/ambulance-request";
import UpdateRequestDialog from "./update-requests-dialog";
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
import {
  Pencil,
  Trash2,
  MapPin,
  Calendar,
  User,
  Ambulance,
} from "lucide-react";
import { format } from "date-fns";
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

  console.log("data", data);

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">
              Request #{data._id.slice(-6)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              <User className="inline-block w-4 h-4 mr-1" />
              {data.requester.fullname}
            </p>
          </div>
          <Badge className={`${statusStyle.color} text-white px-3 py-1`}>
            {statusStyle.icon} {data.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
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

        <div className="flex justify-end gap-2 pt-4 border-t">
          <UpdateRequestDialog
            requestId={data._id}
            accessToken={accessToken}
            ambulanceId={data.ambulance._id}
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
          </UpdateRequestDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex gap-2 items-center"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Ambulance Request</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this ambulance request? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
