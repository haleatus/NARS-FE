"use client";

import { Ambulance } from "@/core/interface/ambulance.interface";
import { MapPin, Phone, Edit, Trash } from "lucide-react";
import React from "react";
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

const GetAllAmbulanceAdminClient = ({
  ambulanceData,
}: {
  ambulanceData: Ambulance[];
}) => {
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
                    <Button variant="ghost" size="smallicon">
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
    </div>
  );
};

export default GetAllAmbulanceAdminClient;
