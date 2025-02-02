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

interface UpdateAmbulanceFormProps {
  adminAccessToken: string;
  ambulanceId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UpdateAmbulanceForm({
  adminAccessToken,
  ambulanceId,
  onSuccess,
  onCancel,
}: UpdateAmbulanceFormProps) {
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name.includes("hospital_location.")) {
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
      updateAmbulanceSchema.parse(formData);

      const result = await updateAmbulanceAction(
        adminAccessToken,
        ambulanceId,
        formData
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Ambulance updated successfully");

      // Add this check before calling onSuccess
      if (onSuccess) {
        try {
          onSuccess();
        } catch (redirectError) {
          // Ignore NEXT_REDIRECT errors
          if (
            !(redirectError instanceof Error) ||
            redirectError.message !== "NEXT_REDIRECT"
          ) {
            throw redirectError;
          }
        }
      }
    } catch (error: any) {
      // Only show error toast for non-redirect errors
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
        <CardTitle>Update Ambulance </CardTitle>
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

          {/* Albulance Location Fields */}
          <div className="space-y-4">
            <h3 className="font-medium">Location</h3>
            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium mb-1"
              >
                Latitude
              </label>
              <Input
                id="latitude"
                name="hospital_location.latitude"
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
                name="hospital_location.longitude"
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
