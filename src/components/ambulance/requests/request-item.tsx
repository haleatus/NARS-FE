"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { MapPin, Calendar, Ambulance } from "lucide-react";
import { format } from "date-fns";
import type { AmbulanceRequest } from "@/core/interface/ambulance/request";
import updateMyAmbulanceRequestStatus from "@/app/actions/ambulance/requests/update-my-ambulance-request-status.action";
import { toast } from "sonner";

interface RequestItemProps {
  data: AmbulanceRequest;
  accessToken: string;
  onUpdate?: () => void;
  onNavigate?: (request: AmbulanceRequest) => void;
}

export const RequestItem: React.FC<RequestItemProps> = ({
  data,
  accessToken,
  onUpdate,
  onNavigate,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(data.status);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusConfig = {
    PENDING: { color: "bg-amber-100 text-amber-700", icon: "🕒" },
    COMPLETED: { color: "bg-green-100 text-green-700", icon: "✅" },
    ENROUTE: { color: "bg-blue-100 text-blue-700", icon: "🚑" },
  };

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    const result = await updateMyAmbulanceRequestStatus({
      accessToken,
      status: selectedStatus,
      requestID: data._id,
    });

    setIsUpdating(false);
    setIsDialogOpen(false);

    if (result.error) {
      toast.error(`Failed to update status: ${result.error}`);
    } else {
      onUpdate?.();
      toast.success("Status updated successfully");
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow transition-all duration-300 bg-white">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          {/* Header with requester info and status */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                {data.requester.fullname.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-medium">
                  {data.requester.fullname}
                </h3>
                <p className="text-xs text-gray-500">{data.requester.email}</p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                statusConfig[data.status as keyof typeof statusConfig].color
              }`}
            >
              {statusConfig[data.status as keyof typeof statusConfig].icon}{" "}
              {data.status}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <InfoItem
              icon={<Ambulance className="w-4 h-4" />}
              label="Driver"
              value={data.ambulance.driver_name}
            />
            <InfoItem
              icon={<Calendar className="w-4 h-4" />}
              label="Created"
              value={format(new Date(data.createdAt), "MMM d, h:mm a")}
            />
          </div>

          {/* Hospital location */}
          <div className="bg-gray-50 p-2 rounded-md text-sm flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <span className="text-xs text-gray-500">Hospital Location</span>
              <p className="font-mono text-xs">
                {Number(data.hospital_location.latitude).toFixed(6)},{" "}
                {Number(data.hospital_location.longitude).toFixed(6)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onNavigate?.(data)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
            >
              <MapPin className="w-4 h-4 mr-1.5" />
              Navigate
            </Button>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-200"
                >
                  Update Status
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-xs">
                <AlertDialogHeader>
                  <AlertDialogTitle>Update Request Status</AlertDialogTitle>
                  <AlertDialogDescription>
                    <select
                      className="w-full mt-2 border rounded p-2 text-sm"
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(
                          e.target.value as keyof typeof statusConfig
                        )
                      }
                    >
                      {Object.entries(statusConfig).map(([status, config]) => (
                        <option key={status} value={status}>
                          {config.icon} {status}
                        </option>
                      ))}
                    </select>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-sm">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                    className="bg-red-500 hover:bg-red-600 text-sm"
                  >
                    {isUpdating ? "Updating..." : "Confirm"}
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
