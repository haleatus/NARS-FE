/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserAmbulanceRequest } from "@/core/interface/user/ambulance-request";
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
import { MapPin, Ambulance, X, PhoneCall, UserCog2 } from "lucide-react";
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
      color: "bg-amber-100 text-amber-700",
      icon: "🕒",
    },
    ACCEPTED: {
      color: "bg-green-100 text-green-700",
      icon: "✅",
    },
    REJECTED: {
      color: "bg-red-100 text-red-700",
      icon: "❌",
    },
  } as const;

  const statusStyle = statusConfig[data.status] || {
    color: "bg-gray-100 text-gray-700",
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

      toast.success("Ambulance request cancelled successfully");
      onDelete?.();
    } catch (error) {
      toast.error("Failed to cancel ambulance request");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow transition-all duration-300 bg-white font-sans">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          {/* Header with request ID and status */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-lg">
                {data.requester.fullname.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">Request #{data._id.slice(-6)}</h3>
                <p className="text-gray-500">{data.requester.fullname}</p>
              </div>
            </div>
            <Badge
              className={`${statusStyle.color} border-none px-2 py-1 text-md font-medium`}
            >
              {statusStyle.icon} {data.status}
            </Badge>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-md">
            <InfoItem
              icon={<Ambulance className="w-4 h-4 text-blue-500" />}
              label="Ambulance"
              value={data.ambulance.ambulance_number}
            />
            <InfoItem
              icon={<UserCog2 className="w-4 h-4 text-purple-500" />}
              label="Driver"
              value={data.ambulance.driver_name}
            />
            <InfoItem
              icon={<PhoneCall className="w-4 h-4 text-green-500" />}
              label="Contact"
              value={data.ambulance.contact}
            />
          </div>

          {/* Hospital location */}
          <div className="bg-gray-50 p-2 rounded-md text-md flex items-start gap-2">
            <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
            <div>
              <span className="text-xs text-gray-500">Hospital Location</span>
              <p className="font-mono text-md">
                {parseFloat(data.hospital_location.latitude).toFixed(6)},{" "}
                {parseFloat(data.hospital_location.longitude).toFixed(6)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2 font-sans">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-red-500 hover:text-red-600 hover:bg-red-50"
                  disabled={isDeleting}
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Cancel Request
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md font-sans">
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Ambulance Request</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this ambulance request? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-sm">
                    No, keep it
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-sm"
                  >
                    {isDeleting ? "Cancelling..." : "Yes, cancel it"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <div className="bg-gray-100 p-1.5 rounded-md">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  </div>
);
