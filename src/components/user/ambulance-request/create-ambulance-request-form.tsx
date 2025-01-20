/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { createAmbulanceRequestSchema } from "@/app/schema/user/ambulance-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import createAmbulanceRequest from "@/app/actions/user/ambulance-request/create-ambulance-request.action";
import { toast } from "sonner";

interface CreateAmbulanceRequestFormProps {
  ambulanceId: string;
  accessToken: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateAmbulanceRequestForm({
  ambulanceId,
  accessToken,
  onSuccess,
  onCancel,
}: CreateAmbulanceRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    ambulance: ambulanceId,
    hospital_location: {
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
        hospital_location: {
          ...prev.hospital_location,
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
      // Validate the data
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
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create Ambulance Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden Ambulance ID field */}
          <input type="hidden" name="ambulance" value={ambulanceId} />

          {/* Display selected ambulance ID */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Selected Ambulance</p>
            <p className="font-medium">{ambulanceId}</p>
          </div>

          {/* Hospital Location Fields */}
          <div className="space-y-4">
            <h3 className="font-medium">Hospital Location</h3>

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
                value={formData.hospital_location.latitude}
                onChange={handleInputChange}
                placeholder="Enter latitude"
                className={
                  errors["hospital_location.latitude"] ? "border-red-500" : ""
                }
              />
              {errors["hospital_location.latitude"] && (
                <p className="text-sm text-red-500 mt-1">
                  {errors["hospital_location.latitude"]}
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
                value={formData.hospital_location.longitude}
                onChange={handleInputChange}
                placeholder="Enter longitude"
                className={
                  errors["hospital_location.longitude"] ? "border-red-500" : ""
                }
              />
              {errors["hospital_location.longitude"] && (
                <p className="text-sm text-red-500 mt-1">
                  {errors["hospital_location.longitude"]}
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
                "Create Request"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
