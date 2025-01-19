"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateAmbulanceRequestForm } from "./update-ambulance-request-form";

interface UpdateRequestDialogProps {
  requestId: string;
  accessToken: string;
  ambulanceId: string;
  initialData: {
    hospital_location: {
      latitude: string;
      longitude: string;
    };
  };
  onSuccess?: () => void;
  children: React.ReactNode;
}

const UpdateRequestDialog = ({
  requestId,
  accessToken,
  ambulanceId,
  initialData,
  onSuccess,
  children,
}: UpdateRequestDialogProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Update Ambulance Request #{requestId.slice(-6)}
          </DialogTitle>
        </DialogHeader>
        <UpdateAmbulanceRequestForm
          requestId={requestId}
          accessToken={accessToken}
          ambulanceId={ambulanceId}
          initialData={{
            hospital_location: {
              latitude: initialData.hospital_location.latitude,
              longitude: initialData.hospital_location.longitude,
            },
          }}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRequestDialog;
