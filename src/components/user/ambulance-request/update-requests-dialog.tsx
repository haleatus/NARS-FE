"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UpdateAmbulanceRequestForm } from "./update-ambulance-request-form";
import { Pencil } from "lucide-react";

const UpdateRequestDialog = ({
  requestId,
  accessToken,
  ambulanceId,
  initialData,
  onSuccess,
}: {
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
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex gap-2 items-center">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Ambulance Request</DialogTitle>
        </DialogHeader>
        <UpdateAmbulanceRequestForm
          requestId={requestId}
          accessToken={accessToken}
          ambulanceId={ambulanceId}
          initialData={initialData}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRequestDialog;
