"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, User, Ambulance, Calendar, Mail } from "lucide-react";
import { UserAmbulanceRequest } from "@/core/interface/user/ambulance-request";

interface AmbulanceRequestTableProps {
  ambulanceRequestsData: UserAmbulanceRequest;
}

const GetAmbulanceRequestByIdClient: React.FC<AmbulanceRequestTableProps> = ({
  ambulanceRequestsData,
}) => {
  // Consistent date formatting
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="container mx-auto p-4 font-work-sans">
      <h1 className="text-3xl font-bold mb-6">Ambulance Request Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Requester Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <span className="font-semibold">Name:</span>{" "}
              {ambulanceRequestsData.requester.fullname}
            </div>
            <div className="mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              <span className="font-semibold">Email:</span>{" "}
              {ambulanceRequestsData.requester.email}
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span className="font-semibold">Contact:</span>{" "}
              {ambulanceRequestsData.requester.contact}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ambulance className="w-5 h-5 mr-2" />
              Ambulance Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <span className="font-semibold">Driver:</span>{" "}
              {ambulanceRequestsData.ambulance.driver_name}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Ambulance Number:</span>{" "}
              {ambulanceRequestsData.ambulance.ambulance_number}
            </div>
            <div className="mb-2 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span className="font-semibold">Contact:</span>{" "}
              {ambulanceRequestsData.ambulance.contact}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="font-semibold">Location:</span>{" "}
              {ambulanceRequestsData.ambulance.location.latitude},{" "}
              {ambulanceRequestsData.ambulance.location.longitude}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Hospital Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <span className="font-semibold">Latitude:</span>{" "}
              {ambulanceRequestsData.hospital_location.latitude}
            </div>
            <div>
              <span className="font-semibold">Longitude:</span>{" "}
              {ambulanceRequestsData.hospital_location.longitude}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Request Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <span className="font-semibold">Request ID:</span>{" "}
              {ambulanceRequestsData._id}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Created At:</span>{" "}
              {formatDate(ambulanceRequestsData.createdAt)}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Updated At:</span>{" "}
              {formatDate(ambulanceRequestsData.updatedAt)}
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Status:</span>
              <Badge
                variant={
                  ambulanceRequestsData.status === "PENDING"
                    ? "default"
                    : ambulanceRequestsData.status === "ACCEPTED"
                    ? "success"
                    : "destructive"
                }
              >
                {ambulanceRequestsData.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GetAmbulanceRequestByIdClient;
