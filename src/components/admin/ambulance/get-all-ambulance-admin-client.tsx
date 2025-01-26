"use client";

import { Ambulance } from "@/core/types/ambulance.interface";
import { MapPin, Phone, Info } from "lucide-react";
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
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/ambulance/${ambulance._id}`}
                        className="flex justify-center items-center text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <Info className="w-5 h-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View More Details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GetAllAmbulanceAdminClient;
