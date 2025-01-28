"use client";

import { useUser } from "@/context/user-context";
import Image from "next/image";
import React from "react";

const ProfileClient = () => {
  const { user } = useUser();

  // Fallback static data for now
  const userProfile = {
    fullname: user?.fullname || "Rohit Shrestha",
    email: user?.email || "unicord1@gmail.com",
    contact: user?.contact || "9840883711",
    bio: "Tech enthusiast, event explorer, and coding ninja. 🚀 Passionate about building innovative digital experiences.",
    // avatarUrl: user?.avatarUrl || "https://via.placeholder.com/150", // Replace with actual avatar if available
    avatarUrl:
      "https://images.pexels.com/photos/220731/pexels-photo-220731.jpeg?auto=compress&cs=tinysrgb&w=600", // Replace with actual avatar if available
    location: "Kathmandu, Nepal",
    memberSince: new Date(
      user?.createdAt || "2025-01-14T07:36:21.590Z"
    ).toLocaleDateString(),
  };

  return (
    <div className="flex items-center justify-center font-mono">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Image
            src={userProfile.avatarUrl}
            alt="Profile Avatar"
            className="w-16 h-16 rounded-full shadow-lg"
            width={64}
            height={64}
          />
          <div>
            <h1 className="text-2xl font-semibold">{userProfile.fullname}</h1>
            <p className="text-sm ">Member since {userProfile.memberSince}</p>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-sm">{userProfile.bio}</p>

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
            <span className="font-medium">{userProfile.location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md text-white">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
