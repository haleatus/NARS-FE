"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MapPin, Calendar, User, Ambulance, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import type { AmbulanceRequest } from "@/core/types/ambulance/request";
import updateMyAmbulanceRequestStatus from "@/app/actions/ambulance/requests/update-my-ambulance-request-status.action";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const dropdownStatusConfig = {
    PENDING: { color: "text-yellow-500", icon: "🕒" },
    COMPLETED: { color: "text-green-500", icon: "✅" },
    ENROUTE: { color: "text-blue-500", icon: "🚑" },
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
      toast.success("Status updated successfully.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden font-work-sans">
        <CardHeader
          className="p-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex justify-between items-center">
            <CardTitle className="text-md flex items-center gap-2 font-sans">
              Request By
              <span className="text-xs">
                {data.requester.fullname.split(" ")[0]} | {data.requester.email}
              </span>
              <ChevronDown
                className={`ml-2 w-4 h-4 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </CardTitle>
          </div>
        </CardHeader>
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardContent className="p-2 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <InfoItem
                icon={<User className="w-4 h-4" />}
                label="Requester"
                value={data.requester.fullname}
              />
              <InfoItem
                icon={<Ambulance className="w-4 h-4" />}
                label="Ambulance ID"
                value={data.ambulance._id}
              />
              <InfoItem
                icon={<MapPin className="w-4 h-4" />}
                label="Hospital"
                value={`${data.hospital_location.latitude}, ${data.hospital_location.longitude}`}
              />
              <InfoItem
                icon={<Calendar className="w-4 h-4" />}
                label="Created"
                value={format(new Date(data.createdAt), "PPp")}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onNavigate?.(data)}
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Navigate
              </Button>
              <select
                className="flex-grow border rounded p-2 text-sm border-black/50 bg-white dark:bg-gray-800 transition-colors duration-200"
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value as keyof typeof dropdownStatusConfig
                  )
                }
              >
                {Object.entries(dropdownStatusConfig).map(
                  ([status, config]) => (
                    <option
                      key={status}
                      value={status}
                      className={config.color}
                    >
                      {config.icon} {status}
                    </option>
                  )
                )}
              </select>

              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-500 text-white rounded font-mono font-bold hover:bg-blue-600 transition-colors duration-200"
                  >
                    Update
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
        </motion.div>
      </Card>
    </motion.div>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-sm transition-colors duration-200">
    <div className="bg-white dark:bg-gray-700 p-2 rounded-full">{icon}</div>
    <div>
      <p className="font-medium text-gray-600 dark:text-gray-300">{label}</p>
      <p className="text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  </div>
);
