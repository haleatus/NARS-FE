"use client";

import { EmergencyButton } from "@/components/emergency/emergency-button";
import { LocateFixedIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";

const ambulanceData = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/17809395/pexels-photo-17809395/free-photo-of-an-ambulance-of-the-chicago-fire-department-on-the-street.jpeg?auto=compress&cs=tinysrgb&w=800",
    phone: "+1 234 567 890",
    plate: "AB-1234",
    distance: "2.5 km",
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/6765299/pexels-photo-6765299.jpeg?auto=compress&cs=tinysrgb&w=800",
    phone: "+1 987 654 321",
    plate: "CD-5678",
    distance: "4.0 km",
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/12312312/pexels-photo-12312312.jpeg?auto=compress&cs=tinysrgb&w=800",
    phone: "+1 345 678 901",
    plate: "EF-9012",
    distance: "6.2 km",
  },
  {
    id: 4,
    image:
      "https://images.pexels.com/photos/6785439/pexels-photo-6785439.jpeg?auto=compress&cs=tinysrgb&w=800",
    phone: "+1 456 789 012",
    plate: "GH-3456",
    distance: "8.7 km",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Location Header */}
      <div className="flex justify-end items-center">
        <div className="bg-red-600 text-white flex gap-2 cursor-pointer items-center font-lora w-fit pl-2 pr-3 py-1.5 rounded-full text-sm">
          <LocateFixedIcon className="h-4 w-4" />
          Your Location
        </div>
      </div>

      {/* Main Section */}
      <div className="flex justify-between items-center w-full gap-4">
        <div className="space-y-4 w-1/2">
          {/* Informative Content */}
          <p className="text-lg font-medium text-gray-700">
            Our app provides real-time access to nearby ambulances for
            emergencies. Quickly find and connect with the closest emergency
            services to ensure timely help when you need it the most.
          </p>
          <EmergencyButton />
        </div>
        <div className="w-1/2 h-[500px] relative overflow-hidden bg-gray-200 rounded-md drop-shadow-lg shadow-black/35">
          <Image
            src="https://images.pexels.com/photos/17809395/pexels-photo-17809395/free-photo-of-an-ambulance-of-the-chicago-fire-department-on-the-street.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Ambulance"
            fill
            className="object-cover "
          />
        </div>
      </div>

      {/* Nearby Ambulances Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Nearby Ambulances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ambulanceData.map((ambulance) => (
            <div
              key={ambulance.id}
              className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Image
                src={ambulance.image}
                alt="Ambulance"
                width={300}
                height={200}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">
                  Ambulance {ambulance.plate}
                </h3>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-red-600" />
                  {ambulance.phone}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2 mt-1">
                  <MapPinIcon className="h-4 w-4 text-blue-600" />
                  {ambulance.distance} away
                </p>
                <button
                  onClick={() => window.open(`tel:${ambulance.phone}`, "_self")}
                  className="mt-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
                >
                  Call Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
