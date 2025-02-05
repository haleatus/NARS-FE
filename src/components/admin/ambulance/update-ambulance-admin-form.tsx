/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import updateAmbulanceAction from "@/app/actions/admin/ambulance/update-ambulance.action";
import { toast } from "sonner";
import { updateAmbulanceSchema } from "@/app/schema/admin/ambulance/ambulance.schema";
import { Ambulance } from "@/core/interface/ambulance.interface";
import Map, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface UpdateAmbulanceFormProps {
  adminAccessToken: string;
  ambulanceData: Ambulance;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UpdateAmbulanceForm({
  adminAccessToken,
  ambulanceData,
  onSuccess,
  onCancel,
}: UpdateAmbulanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    driver_name: ambulanceData.driver_name,
    ambulance_number: ambulanceData.ambulance_number,
    contact: ambulanceData.contact,
    location: {
      latitude: ambulanceData.location.latitude,
      longitude: ambulanceData.location.longitude,
    },
  });

  const [viewState, setViewState] = useState({
    latitude: 27.70885, // Default latitude
    longitude: 85.321741, // Default longitude
    zoom: 12,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name.includes("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMapClick = (event: any) => {
    const { lngLat } = event;
    setFormData((prev) => ({
      ...prev,
      location: {
        latitude: lngLat.lat.toString(),
        longitude: lngLat.lng.toString(),
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      updateAmbulanceSchema.parse(formData);

      const result = await updateAmbulanceAction(
        adminAccessToken,
        ambulanceData._id,
        formData
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Ambulance updated successfully");

      if (onSuccess) {
        try {
          onSuccess();
        } catch (redirectError) {
          if (
            !(redirectError instanceof Error) ||
            redirectError.message !== "NEXT_REDIRECT"
          ) {
            throw redirectError;
          }
        }
      }
    } catch (error: any) {
      if (!(error instanceof Error) || error.message !== "NEXT_REDIRECT") {
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
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>
          Update Ambulance {ambulanceData.ambulance_number}{" "}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ambulance Driver Fields */}
          <div>
            <label
              htmlFor="driver_name"
              className="block text-sm font-medium mb-1"
            >
              Driver Name
            </label>
            <Input
              id="driver_name"
              name="driver_name"
              value={formData.driver_name}
              onChange={handleInputChange}
              placeholder="Enter driver name"
              className={errors.driver_name ? "border-red-500" : ""}
            />
            {errors.driver_name && (
              <p className="text-sm text-red-500 mt-1">{errors.driver_name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="ambulance_number"
              className="block text-sm font-medium mb-1"
            >
              Ambulance Number
            </label>
            <Input
              id="ambulance_number"
              name="ambulance_number"
              value={formData.ambulance_number}
              onChange={handleInputChange}
              placeholder="Enter ambulance number"
              className={errors.ambulance_number ? "border-red-500" : ""}
            />
            {errors.ambulance_number && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ambulance_number}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium mb-1">
              Contact
            </label>
            <Input
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="Enter contact"
              className={errors.contact ? "border-red-500" : ""}
            />
            {errors.contact && (
              <p className="text-sm text-red-500 mt-1">{errors.contact}</p>
            )}
          </div>

          {/* Map Picker for Location */}
          <div className="space-y-4">
            <h3 className="font-medium">Location</h3>
            <div className="h-64 w-full">
              <Map
                {...viewState}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                onMove={(evt) => setViewState(evt.viewState)}
                onClick={handleMapClick}
                minZoom={5}
                maxZoom={20}
              >
                <NavigationControl />
                {formData.location.latitude && formData.location.longitude && (
                  <Marker
                    latitude={parseFloat(formData.location.latitude)}
                    longitude={parseFloat(formData.location.longitude)}
                  />
                )}
              </Map>
            </div>

            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium mb-1"
              >
                Latitude
              </label>
              <Input
                id="latitude"
                name="location.latitude"
                value={formData.location.latitude}
                onChange={handleInputChange}
                placeholder="Enter latitude"
                className={errors["location.latitude"] ? "border-red-500" : ""}
              />
              {errors["location.latitude"] && (
                <p className="text-sm text-red-500 mt-1">
                  {errors["location.latitude"]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="longitude"
                className="block text-sm font-medium mb-1"
              >
                Longitude
              </label>
              <Input
                id="longitude"
                name="location.longitude"
                value={formData.location.longitude}
                onChange={handleInputChange}
                placeholder="Enter longitude"
                className={errors["location.longitude"] ? "border-red-500" : ""}
              />
              {errors["location.longitude"] && (
                <p className="text-sm text-red-500 mt-1">
                  {errors["location.longitude"]}
                </p>
              )}
            </div>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Ambulance"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
