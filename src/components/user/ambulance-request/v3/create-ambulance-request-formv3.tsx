/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { createAmbulanceRequestSchema } from "@/app/schema/user/ambulance-request";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";
import createAmbulanceRequest from "@/app/actions/user/ambulance-request/create-ambulance-request.action";
import { toast } from "sonner";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 27.7172,
  lng: 85.324,
};

interface CreateAmbulanceRequestFormProps {
  ambulanceId: string;
  accessToken: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  ambulanceNumber: string;
  ambulanceDriver: string;
}

export function CreateAmbulanceRequestFormV3({
  ambulanceId,
  accessToken,
  onSuccess,
  onCancel,
  ambulanceNumber,
  ambulanceDriver,
}: CreateAmbulanceRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedHospital, setSelectedHospital] = useState<any>(null);

  const [formData, setFormData] = useState({
    ambulance: ambulanceId,
    hospital_location: {
      latitude: "",
      longitude: "",
    },
  });

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      setSelectedHospital({ latitude, longitude, name: "Selected Hospital" });
      setFormData({
        ...formData,
        hospital_location: {
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        },
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      createAmbulanceRequestSchema.parse(formData);
      const result = await createAmbulanceRequest({
        accessToken,
        createAmbulanceRequestData: formData,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Ambulance request created successfully");
      onSuccess?.();
    } catch (error: any) {
      if (error.errors) {
        const validationErrors: { [key: string]: string } = {};
        error.errors.forEach((err: any) => {
          const path = err.path.join(".");
          validationErrors[path] = err.message;
        });
        setErrors(validationErrors);
        toast.error("Validation Error: Please check the form for errors");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto font-sans">
      <CardHeader>
        <CardTitle>Create Ambulance Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="ambulance" value={ambulanceId} />

          {/* Display selected ambulance */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Selected Ambulance</p>
            <p className="font-medium">{ambulanceDriver}</p>
            <p className="font-medium">{ambulanceNumber}</p>
          </div>

          {/* Google Map for Hospital Selection */}
          <div className="space-y-4">
            <h3 className="font-medium">Select Hospital Location</h3>
            <LoadScript
              googleMapsApiKey={
                process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
              }
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={14}
                onClick={handleMapClick}
              >
                {selectedHospital && (
                  <Marker
                    position={{
                      lat: selectedHospital.latitude,
                      lng: selectedHospital.longitude,
                    }}
                  />
                )}
              </GoogleMap>
            </LoadScript>

            {selectedHospital ? (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{selectedHospital.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Latitude: {selectedHospital.latitude}
                </p>
                <p className="text-sm text-muted-foreground">
                  Longitude: {selectedHospital.longitude}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Please select a hospital by clicking on the map
                </p>
              </div>
            )}
            {errors["hospital_location"] && (
              <p className="text-red-500 text-sm">
                {errors["hospital_location"]}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedHospital}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Request"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
