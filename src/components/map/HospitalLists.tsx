"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IHospital } from "@/core/interface/hospital.interface";
import { Navigation, Search, MapPin } from "lucide-react";

interface HospitalListProps {
  hospitals: IHospital[];
  onSelectHospital: (hospital: IHospital | null) => void;
  onNavigateToHospital: (hospital: IHospital) => void;
  selectedHospital: IHospital | null;
  userLocation: [number, number];
  maxDistance?: number;
}

interface HospitalWithDistance extends IHospital {
  distance: number;
}

const HospitalList: React.FC<HospitalListProps> = ({
  hospitals,
  onSelectHospital,
  onNavigateToHospital,
  selectedHospital,
  userLocation,
  maxDistance = 8,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  // Simplified search function that's more stable
  const searchHospital = (
    hospital: HospitalWithDistance,
    term: string
  ): boolean => {
    try {
      // Convert both hospital name and search term to lowercase
      const hospitalName = hospital.name.toLowerCase();
      const searchTerm = term.toLowerCase();

      // Basic string includes check
      if (hospitalName.includes(searchTerm)) {
        return true;
      }

      // Simple transliteration for common Nepali-English mappings
      const simpleMappings: { [key: string]: string[] } = {
        श्री: ["shree", "sri"],
        अस्पताल: ["hospital", "aspatal"],
        मेडिकल: ["medical"],
        सेन्टर: ["center", "centre"],
        स्वास्थ्य: ["swasthya", "health"],
        केन्द्र: ["kendra", "center"],
      };

      // Check if any of the mappings match
      return Object.entries(simpleMappings).some(([nepali, english]) => {
        if (hospitalName.includes(nepali)) {
          return english.some((eng) => searchTerm.includes(eng));
        }
        return false;
      });
    } catch (error) {
      // If anything goes wrong during search, return false instead of crashing
      console.error("Search error:", error);
      return false;
    }
  };

  // Filter and sort hospitals
  const nearbyHospitals = useMemo(() => {
    try {
      // First add distances and filter by max distance
      const hospitalsWithDistance: HospitalWithDistance[] = hospitals
        .map((hospital) => ({
          ...hospital,
          distance: calculateDistance(
            userLocation[1],
            userLocation[0],
            hospital.latitude,
            hospital.longitude
          ),
        }))
        .filter((hospital) => hospital.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);

      // Then apply search if there's a search term
      if (!searchTerm.trim()) {
        return hospitalsWithDistance;
      }

      return hospitalsWithDistance.filter((hospital) =>
        searchHospital(hospital, searchTerm)
      );
    } catch (error) {
      console.error("Filter error:", error);
      return [];
    }
  }, [hospitals, searchTerm, userLocation, maxDistance]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSearchTerm(e.target.value);
    } catch (error) {
      console.error("Search input error:", error);
      setSearchTerm("");
    }
  };

  return (
    <Card className="relative w-full h-full font-sans">
      <CardHeader>
        <CardTitle>
          Nearby Hospitals{" "}
          <span className="text-xs text-blue-500">
            (Click on hospital name to select)
          </span>
        </CardTitle>

        <div className="relative">
          <Input
            placeholder="Search nearby hospitals..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
          <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <div className="text-sm text-gray-500 flex gap-1 justify-between items-center">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Showing hospitals within {maxDistance}km
          </div>
          {selectedHospital && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectHospital(null)}
              className="text-black hover:text-red-700 bg-red-500/40 h-5 hover:bg-red-100"
            >
              Clear Selection
            </Button>
          )}
        </div>
      </CardHeader>
      <ScrollArea className="h-[calc(100%-10rem)] ">
        <CardContent>
          {nearbyHospitals.length > 0 ? (
            nearbyHospitals.map((hospital, index) => (
              <div
                key={index}
                className={`p-2 border-b last:border-b-0 hover:bg-red-100 transition-colors ${
                  selectedHospital?.name === hospital.name ? "bg-blue-200" : ""
                }`}
              >
                <div className={`flex justify-between items-start gap-4  `}>
                  <div
                    className={`flex-1 cursor-pointer ${
                      selectedHospital?.name === hospital.name
                        ? "text-blue-800"
                        : ""
                    }`}
                    onClick={() => onSelectHospital(hospital)}
                  >
                    <h3 className="font-semibold text-sm mb-1">
                      {hospital.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {formatDistance(hospital.distance)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => onNavigateToHospital(hospital)}
                  >
                    <Navigation size={16} />
                    Navigate
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No nearby hospitals found
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default HospitalList;
