"use client";

import { Ambulance } from "@/core/types/ambulance.interface";
import { MapPin, Phone, Navigation } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

interface GetAllAmbulanceClientProps {
  ambulanceData: Ambulance[];
  onNavigateToAmbulance?: (ambulanceId: string) => void;
}

const GetAllAmbulanceClient: React.FC<GetAllAmbulanceClientProps> = ({
  ambulanceData,
  onNavigateToAmbulance,
}) => {
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
                <Link
                  href={`/ambulance/${ambulance._id}`}
                  className="text-xs text-blue-500 cursor-pointer font-sans underline"
                >
                  View More →
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateToAmbulance?.(ambulance._id)}
                  className="flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Navigate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GetAllAmbulanceClient;
