"use client";

import { Ambulance } from "@/core/types/ambulance.interface";
import { MapPin, Phone, Navigation, Plus } from "lucide-react";
import React, { useState } from "react"; // Added useState import
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CreateAmbulanceRequestForm } from "../user/ambulance-request/create-ambulance-request-form";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface GetAllAmbulanceClientProps {
  ambulanceData: Ambulance[];
  onNavigateToAmbulance?: (ambulanceId: string) => void;
  accessToken: string;
}

const GetAllAmbulanceClient: React.FC<GetAllAmbulanceClientProps> = ({
  ambulanceData,
  onNavigateToAmbulance,
  accessToken,
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Added dialog state

  return (
    <div className="container mx-auto p-4 font-work-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ambulanceData.map((ambulance) => (
          <Card key={ambulance._id} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">
                  {ambulance.driver_name}
                </h2>
                <Badge
                  variant={
                    ambulance.status === "AVAILABLE" ? "default" : "destructive"
                  }
                >
                  {ambulance.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Ambulance Number:</span>{" "}
                {ambulance.ambulance_number}
              </p>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Phone className="w-4 h-4 mr-2" />
                {ambulance.contact}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                {ambulance.location.latitude}, {ambulance.location.longitude}
              </div>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateToAmbulance?.(ambulance._id)}
                  className="flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Navigate
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsDialogOpen(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] p-0">
                    <DialogHeader className="hidden">
                      <DialogTitle>Request Ambulance</DialogTitle>
                    </DialogHeader>
                    <CreateAmbulanceRequestForm
                      ambulanceId={ambulance._id}
                      accessToken={accessToken}
                      onSuccess={() => {
                        setIsDialogOpen(false); // Close dialog on success
                        router.push("/my-requests");
                      }}
                      onCancel={() => {
                        setIsDialogOpen(false); // Close dialog on cancel
                        if (window.history.length > 1) {
                          window.history.back();
                        } else {
                          router.push("/ambulance");
                        }
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GetAllAmbulanceClient;
