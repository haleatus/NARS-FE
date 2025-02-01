import { Ambulance } from "@/core/types/ambulance.interface";
import { MapPin, Phone } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import Link from "next/link";

const GetAllAmbulanceClient = ({
  ambulanceData,
}: {
  ambulanceData: Ambulance[];
}) => {
  return (
    <div className="container mx-auto p-4 font-work-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ambulanceData.map((ambulance) => (
          <Card key={ambulance._id} className="relative overflow-hidden">
            <Link
              href={`/ambulance/${ambulance._id}`}
              className="absolute bottom-2 right-2 text-xs text-blue-500 cursor-pointer font-sans underline"
            >
              View More →
            </Link>
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
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {ambulance.location.latitude}, {ambulance.location.longitude}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GetAllAmbulanceClient;
