"use client";

import { Ambulance } from "@/core/interface/ambulance.interface";
import { MapPin, Phone, Edit, Trash } from "lucide-react";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateAmbulanceForm } from "./update-ambulance-admin-form";
import { useRouter } from "next/navigation";

const GetAllAmbulanceAdminClient = ({
  adminAccessToken,
  ambulanceData,
}: {
  adminAccessToken: string;
  ambulanceData: Ambulance[];
}) => {
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const openModal = (ambulance: Ambulance) => {
    setSelectedAmbulance(ambulance);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAmbulance(null);
    setIsModalOpen(false);
  };

  const onSuccess = () => {
    closeModal();
    router.refresh();
  };

  return (
    <div className="container mx-auto font-work-sans">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Driver Name</TableHead>
            <TableHead className="text-center">Ambulance Number</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Contact</TableHead>
            <TableHead className="text-center">Location</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ambulanceData.map((ambulance) => (
            <TableRow key={ambulance._id}>
              <TableCell>{ambulance._id}</TableCell>
              <TableCell className="font-medium text-center">
                {ambulance.driver_name}
              </TableCell>
              <TableCell className="text-center">
                {ambulance.ambulance_number}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    ambulance.status === "AVAILABLE" ? "default" : "destructive"
                  }
                >
                  {ambulance.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {ambulance.contact}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Contact Number</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {parseFloat(ambulance.location.latitude).toFixed(
                          4
                        )},{" "}
                        {parseFloat(ambulance.location.longitude).toFixed(4)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Latitude: {ambulance.location.latitude}</p>
                      <p>Longitude: {ambulance.location.longitude}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="smallicon"
                      onClick={() => openModal(ambulance)}
                    >
                      <Edit className="w-4 h-4 text-blue-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Details</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="smallicon">
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Details</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Update Form */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg p-0 h-[calc(100vh-100px)] overflow-y-auto">
          <DialogHeader className="hidden">
            <DialogTitle>Update Ambulance</DialogTitle>
          </DialogHeader>
          {selectedAmbulance && (
            <UpdateAmbulanceForm
              adminAccessToken={adminAccessToken}
              ambulanceData={selectedAmbulance}
              onSuccess={onSuccess}
              onCancel={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetAllAmbulanceAdminClient;
