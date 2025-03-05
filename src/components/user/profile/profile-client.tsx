"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/user-context";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { updateUserService } from "@/app/services/user/update-user.service";
import { toast } from "sonner";

const ProfileClient = ({ accessToken }: { accessToken: string }) => {
  const { user, refetchUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const userProfile = {
    fullname: user?.fullname,
    email: user?.email,
    contact: user?.contact,
    avatarUrl:
      "https://images.pexels.com/photos/220731/pexels-photo-220731.jpeg?auto=compress&cs=tinysrgb&w=600", // Replace with actual avatar if available
    location: user?.location,
    memberSince: new Date(
      user?.createdAt || "2025-01-14T07:36:21.590Z"
    ).toLocaleDateString(),
  };

  const [formData, setFormData] = useState({
    fullname: userProfile.fullname,
    email: userProfile.email,
    contact: userProfile.contact,
    location: {
      latitude:
        typeof userProfile.location === "object"
          ? userProfile.location.latitude
          : "",
      longitude:
        typeof userProfile.location === "object"
          ? userProfile.location.longitude
          : "",
    },
  });

  // Fetch user's real-time location
  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prevData) => ({
          ...prevData,
          location: {
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          },
        }));
        setLocationError(null);
      },
      (error) => {
        setLocationError("Unable to retrieve your location.");
        console.error("Error fetching location:", error);
      }
    );
  };

  useEffect(() => {
    if (isEditing) {
      fetchUserLocation(); // Fetch location automatically when editing starts
    }
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await updateUserService(accessToken, formData);
    if (!response) {
      toast.error("Error updating user profile");
      return;
    }
    toast.success("Profile updated successfully");
    refetchUser();
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  console.log("This is an unnecessary log that is to be removed");

  return (
    <div className="flex items-center justify-center font-mono">
      <Card className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Image
              src={userProfile.avatarUrl || "/placeholder.svg"}
              alt="Profile Avatar"
              className="w-16 h-16 rounded-full shadow-lg"
              width={64}
              height={64}
            />
            <div>
              <h1 className="text-2xl font-semibold">{userProfile.fullname}</h1>
            </div>
          </div>

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                {locationError ? (
                  <p className="text-red-500 text-sm">{locationError}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="latitude" className="text-xs">
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        value={formData.location.latitude}
                        onChange={handleChange}
                        placeholder="Fetching latitude..."
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude" className="text-xs">
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        value={formData.location.longitude}
                        onChange={handleChange}
                        placeholder="Fetching longitude..."
                        readOnly
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={toggleEdit}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <>
              {/* Details Section */}
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Email</span>
                  <span className="font-medium">{userProfile.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Contact</span>
                  <span className="font-medium">{userProfile.contact}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Location</span>
                  <span className="font-medium">
                    {typeof userProfile.location === "object"
                      ? `${userProfile.location.latitude}, ${userProfile.location.longitude}`
                      : ""}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={toggleEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Edit Profile
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileClient;
