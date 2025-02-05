import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { IHospital } from "@/core/types/hospital.interface";
import { Navigation } from "lucide-react";

interface HospitalListProps {
  hospitals: IHospital[];
  onSelectHospital: (hospital: IHospital | null) => void;
  onNavigateToHospital: (hospital: IHospital) => void;
  selectedHospital: IHospital | null;
}

const HospitalList: React.FC<HospitalListProps> = ({
  hospitals,
  onSelectHospital,
  onNavigateToHospital,
  selectedHospital,
}) => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Nearby Hospitals</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[calc(100%-4rem)] px-2">
        <CardContent>
          {hospitals.length > 0 ? (
            hospitals.map((hospital, index) => (
              <div
                key={index}
                className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div
                    className={`flex-1 cursor-pointer ${
                      selectedHospital?.name === hospital.name
                        ? "text-blue-600"
                        : ""
                    }`}
                    onClick={() => onSelectHospital(hospital)}
                  >
                    <h3 className="font-semibold text-sm mb-1">
                      {hospital.name}
                    </h3>
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
              No hospitals found
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default HospitalList;
