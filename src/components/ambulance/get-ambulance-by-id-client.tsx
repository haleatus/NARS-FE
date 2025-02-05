"use client";

import { Ambulance } from "@/core/interface/ambulance.interface";
import { MapPin, Phone, Calendar, Clock, User, Truck } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const GetAmbulanceByIdClient = ({
  ambulanceData,
}: {
  ambulanceData: Ambulance;
}) => {
  const router = useRouter();

  const handleRequestAmbulanceClick = () => {
    router.push(`/ambulance/${ambulanceData._id}/create-request`);
  };
  return (
    <div className="container mx-auto p-4 max-w-3xl font-sans">
      <h1 className="text-3xl font-bold mb-6 font-lora">Ambulance</h1>
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-gray-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">
              {ambulanceData.ambulance_number}
            </CardTitle>
            <Badge
              variant={
                ambulanceData.status === "AVAILABLE" ? "default" : "destructive"
              }
              className="text-sm px-3 py-1"
            >
              {ambulanceData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoItem
                icon={User}
                label="Driver"
                value={ambulanceData.driver_name}
              />
              <InfoItem
                icon={Phone}
                label="Contact"
                value={ambulanceData.contact}
              />
              <InfoItem
                icon={MapPin}
                label="Location"
                value={`${ambulanceData.location.latitude}, ${ambulanceData.location.longitude}`}
              />
            </div>
            <div className="space-y-4">
              <InfoItem
                icon={Calendar}
                label="Created At"
                value={new Date(ambulanceData.createdAt).toLocaleDateString()}
              />
              <InfoItem
                icon={Clock}
                label="Last Updated"
                value={new Date(ambulanceData.updatedAt).toLocaleDateString()}
              />
              <InfoItem
                icon={Truck}
                label="Ambulance ID"
                value={ambulanceData._id}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline">Edit Details</Button>
            <Button variant="default" onClick={handleRequestAmbulanceClick}>
              Request Ambulance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center space-x-3">
    <Icon className="w-5 h-5 text-gray-500" />
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  </div>
);

export default GetAmbulanceByIdClient;
