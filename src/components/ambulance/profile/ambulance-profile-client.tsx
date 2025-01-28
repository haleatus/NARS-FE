"use client";

import { useAmbulance } from "@/context/ambulance-context";
import React from "react";
import { MapPin, Phone, CheckCircle, XCircle, User } from "lucide-react";

const AmbulanceProfileClient = () => {
  const { ambulance } = useAmbulance();

  if (!ambulance) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-center text-2xl font-bold text-gray-700">
          No Ambulance Found
        </h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-6 px-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-white overflow-hidden shadow-md">
            {/* Placeholder for profile picture */}
            <User className="w-full h-full text-blue-600 p-6" />
          </div>
          <h2 className="text-2xl font-bold mt-4">Ambulance Profile</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-600">
              Ambulance Number:
            </span>
            <span className="text-gray-800">
              {ambulance.ambulance_number || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-600">Driver Name:</span>
            <span className="text-gray-800">
              {ambulance.driver_name || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-600">Contact:</span>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-gray-500" />
              <span className="text-gray-800">
                {ambulance.contact || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-600">Location:</span>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-gray-800">
                {ambulance.location
                  ? `Lat: ${ambulance.location.latitude}, Lon: ${ambulance.location.longitude}`
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-600">Status:</span>
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${
                ambulance.status === "AVAILABLE"
                  ? "bg-green-100 text-green-800 flex items-center space-x-2"
                  : "bg-red-100 text-red-800 flex items-center space-x-2"
              }`}
            >
              {ambulance.status === "AVAILABLE" ? (
                <CheckCircle className="w-5 h-5 text-green-800" />
              ) : (
                <XCircle className="w-5 h-5 text-red-800" />
              )}
              {ambulance.status || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-600">Created At:</span>
            <span className="text-gray-800">
              {ambulance.createdAt
                ? new Date(ambulance.createdAt).toLocaleString()
                : "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-600">Last Updated:</span>
            <span className="text-gray-800">
              {ambulance.updatedAt
                ? new Date(ambulance.updatedAt).toLocaleString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceProfileClient;
