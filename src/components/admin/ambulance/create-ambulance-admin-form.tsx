/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { createAmbulanceSchema } from "@/app/schema/admin/ambulance/ambulance.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import createAmbulanceAction from "@/app/actions/admin/ambulance/create-ambulance.action";
import { toast } from "sonner";

const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface CreateAmbulanceFormProps {
  adminAccessToken: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

export function CreateAmbulanceForm({
  adminAccessToken,
  onSuccess,
  onCancel,
}: CreateAmbulanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    driver_name: "",
    ambulance_number: "",
    contact: "",
    password: "",
    location: {
      latitude: "",
      longitude: "",
    },
  });

  // Google Maps states
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false); // Track if Google Maps is loaded
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Load Google Maps API script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (
        window.google ||
        document.querySelector('script[src*="maps.googleapis.com"]')
      ) {
        // Google Maps already loaded
        setIsLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, [googleApiKey]);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 27.70885, lng: 85.321741 }, // Kathmandu
      zoom: 12,
    });

    setMap(mapInstance);

    // Add click listener to map
    mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
      const latLng = event.latLng;
      if (latLng) {
        setFormData((prev) => ({
          ...prev,
          location: {
            latitude: latLng.lat().toString(),
            longitude: latLng.lng().toString(),
          },
        }));

        // Update or create marker
        if (markerRef.current) {
          markerRef.current.setPosition(latLng);
        } else {
          markerRef.current = new google.maps.Marker({
            position: latLng,
            map: mapInstance,
            title: "Ambulance Location",
          });
        }
      }
    });
    return () => {
      // Clean up the map when the component unmounts
      if (markerRef.current) {
        markerRef.current.setMap(null); // Remove the marker from the map
      }
    };
  }, [isLoaded]);

  // Update marker position if location in form data changes
  useEffect(() => {
    if (!map || !formData.location.latitude || !formData.location.longitude)
      return;

    const lat = parseFloat(formData.location.latitude);
    const lng = parseFloat(formData.location.longitude);
    const latLng = new window.google.maps.LatLng(lat, lng);

    if (markerRef.current) {
      markerRef.current.setPosition(latLng);
    } else {
      markerRef.current = new google.maps.Marker({
        position: latLng,
        map: map,
        title: "Ambulance Location",
      });
    }

    map.setCenter(latLng); // Center the map on the marker
  }, [formData.location, map]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      createAmbulanceSchema.parse(formData);

      const result = await createAmbulanceAction(adminAccessToken, formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Ambulance created successfully");

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
        <CardTitle>Create Ambulance</CardTitle>
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Map Picker for Location */}
          <div className="space-y-4">
            <h3 className="font-medium">Location</h3>
            <div className="h-64 w-full">
              <div ref={mapRef} className="w-full h-full" />
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
                  Creating...
                </>
              ) : (
                "Create Ambulance"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
