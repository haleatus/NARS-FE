"use client";

import type React from "react";
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
import { MapPin, User, Ambulance, Calendar, Info } from "lucide-react";
import Link from "next/link";
import { UserAmbulanceRequest } from "@/core/types/user/ambulance-request";

interface AmbulanceRequestTableProps {
  ambulanceRequestsData: UserAmbulanceRequest[];
}

const GetAllAmbulanceRequestClient: React.FC<AmbulanceRequestTableProps> = ({
  ambulanceRequestsData,
}) => {
  return (
    <div className="container mx-auto font-work-sans">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request Date</TableHead>
            <TableHead className="text-center">Requester</TableHead>
            <TableHead className="text-center">Ambulance</TableHead>
            <TableHead className="text-center">Hospital Location</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ambulanceRequestsData.map((request) => (
            <TableRow key={request._id}>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Created: {new Date(request.createdAt).toLocaleString()}
                      </p>
                      <p>
                        Updated: {new Date(request.updatedAt).toLocaleString()}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center">
                        <User className="w-4 h-4 mr-2" />
                        {request.requester.fullname}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Email: {request.requester.email}</p>
                      <p>Contact: {request.requester.contact}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center">
                        <Ambulance className="w-4 h-4 mr-2" />
                        {request.ambulance}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>TODO: req ambulance data</p>
                      {/* <p>Driver: {request.ambulance.driver_name}</p>
                      <p>Contact: {request.ambulance.contact}</p>
                      <p>
                        Location: {request.ambulance.location.latitude},{" "}
                        {request.ambulance.location.longitude}
                      </p> */}
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
                        {request.hospital_location.latitude.slice(0, 8)}...
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Latitude: {request.hospital_location.latitude}</p>
                      <p>Longitude: {request.hospital_location.longitude}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    request.status === "PENDING"
                      ? "default"
                      : request.status === "ACCEPTED"
                      ? "success"
                      : "destructive"
                  }
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/admin/ambulance-requests/${request._id}`}
                        className="flex justify-center items-center text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <Info className="w-5 h-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Request Details</p>
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

export default GetAllAmbulanceRequestClient;
