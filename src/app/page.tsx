"use client";

import { EmergencyButton } from "@/components/emergency/emergency-button";
import { motion } from "framer-motion";
import { MapPin, MapPinIcon, Phone, Timer } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ambulanceData = [
  {
    id: "1",
    image:
      "https://images.pexels.com/photos/17809395/pexels-photo-17809395/free-photo-of-an-ambulance-of-the-chicago-fire-department-on-the-street.jpeg?auto=compress&cs=tinysrgb&w=800",
    phone: "+1 234 567 890",
    plate: "AB-1234",
    distance: "2.5 km",
  },
  {
    id: "2",
    image:
      "https://images.pexels.com/photos/3584101/pexels-photo-3584101.jpeg?auto=compress&cs=tinysrgb&w=600",
    phone: "+1 987 654 321",
    plate: "CD-5678",
    distance: "4.0 km",
  },
  {
    id: "3",
    image:
      "https://images.pexels.com/photos/6519838/pexels-photo-6519838.jpeg?auto=compress&cs=tinysrgb&w=600",
    phone: "+1 345 678 901",
    plate: "EF-9012",
    distance: "6.2 km",
  },
  {
    id: "4",
    image:
      "https://images.pexels.com/photos/6519847/pexels-photo-6519847.jpeg?auto=compress&cs=tinysrgb&w=600",
    phone: "+1 456 789 012",
    plate: "GH-3456",
    distance: "8.7 km",
  },
];

export default function Home() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return (
    <div className="container mx-auto p-4 space-y-8 font-sans">
      <div className="flex items-center justify-end">
        <div className="bg-red-600 backdrop-blur-sm flex items-center gap-2 px-2 py-1 rounded-full shadow-sm text-white">
          <MapPinIcon className="h-4 w-4 text-white" />
          <span>Your Location</span>
        </div>
      </div>
      {/* Main Content */}
      <main className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Welcome Satkar</h1>
            <p className="text-gray-600">
              Find the closest ambulance available.
            </p>
          </div>

          <div className="flex justify-center items-center flex-col">
            <EmergencyButton />
          </div>

          <div className="bg-transparent text-black p-2">
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              Closest Ambulances
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              {ambulanceData.map((ambulance) => (
                <motion.div
                  key={ambulance.id}
                  className="relative h-[140px] rounded-sm overflow-hidden cursor-pointer shadow hover:shadow-lg shadow-black"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => setHoveredId(ambulance.id)}
                  onHoverEnd={() => setHoveredId(null)}
                >
                  <Image
                    src={ambulance.image}
                    alt={`Ambulance ${ambulance.plate}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        {ambulance.plate}
                      </span>
                      <span className="text-lg flex items-center">
                        <MapPin className="mr-1 text-red-500" size={18} />
                        {ambulance.distance}
                      </span>
                    </div>
                    {hoveredId === ambulance.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex flex-col gap-2"
                      >
                        <div className="flex items-center text-sm">
                          <Timer className="mr-1 text-green-400" size={16} />
                          Estimated arrival: 5 mins
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-1 text-blue-400" size={16} />
                          <a
                            href={`tel:${ambulance.phone}`}
                            className="hover:text-blue-400 transition-colors"
                          >
                            {ambulance.phone}
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative lg:flex hidden">
          <Image
            src="/home/Home.svg"
            alt="Emergency Services Illustration"
            width={520}
            height={520}
            className="w-full h-[520px]"
          />
        </div>
      </main>
    </div>
  );
}
