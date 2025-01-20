/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { updateAmbulanceRequestSchema } from "@/app/schema/user/ambulance-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import updateAmbulanceRequest from "@/app/actions/user/ambulance-request/update-ambulance-request.action";

interface UpdateAmbulanceRequestFormProps {
  requestId: string;
  accessToken: string;
  ambulanceId: string;
  initialData?: {
    hospital_location: {
      latitude: string;
      longitude: string;
    };
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UpdateAmbulanceRequestForm({
  requestId,
  accessToken,
  ambulanceId,
  initialData,
  onSuccess,
  onCancel,
}: UpdateAmbulanceRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    hospital_location: {
      latitude: "",
      longitude: "",
    },
  });

  // Initialize form with initial data when available
  useEffect(() => {
    if (initialData) {
      setFormData({
        hospital_location: {
          latitude: String(initialData.hospital_location.latitude),
          longitude: String(initialData.hospital_location.longitude),
        },
      });
    }
  }, [initialData]);

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
      const parsedData = {
        ...formData,
        hospital_location: {
          latitude: formData.hospital_location.latitude,
          longitude: formData.hospital_location.longitude,
        },
      };

      updateAmbulanceRequestSchema.parse(parsedData);

      const result = await updateAmbulanceRequest({
        accessToken,
        updateAmbulanceRequestData: {
          ...parsedData,
          hospital_location: {
            latitude: String(parsedData.hospital_location.latitude),
            longitude: String(parsedData.hospital_location.longitude),
          },
        },
        requestID: requestId,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Ambulance request updated successfully");
      onSuccess?.();
    } catch (error: any) {
      if (error.errors) {
        const validationErrors: { [key: string]: string } = {};
        error.errors.forEach((err: any) => {
          const path = err.path.join(".");
          validationErrors[path] = err.message;
        });
        setErrors(validationErrors);
        toast.error("Please check the form for errors");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardContent>
      <div>{ambulanceId}</div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
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
              "Update Request"
            )}
          </Button>
        </div>
      </form>
    </CardContent>
  );
}
