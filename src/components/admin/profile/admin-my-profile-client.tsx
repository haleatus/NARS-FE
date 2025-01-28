"use client";

import { useAdmin } from "@/context/admin-context";
import Image from "next/image";
import React from "react";

const AdminMyProfileClient = () => {
  const { admin } = useAdmin();

  const profileData = {
    username: admin?.username || "Admin Username",
    email: admin?.email || "admin@example.com",
    createdAt: admin?.createdAt
      ? new Date(admin.createdAt).toLocaleDateString()
      : "Unknown Date",
    role: "Super Admin", // Static data for now
    department: "Administration", // Static data for now
  };

  return (
    <div className="flex items-center justify-center font-mono">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-md">
        <div className="text-center">
          <Image
            src="https://images.pexels.com/photos/670720/pexels-photo-670720.jpeg?auto=compress&cs=tinysrgb&w=600" // Replace with a real avatar if available
            alt="Admin Avatar"
            className="w-24 h-24 mx-auto rounded-full shadow-md object-cover"
            width={96}
            height={96}
          />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {profileData.username}
          </h2>
          <p className="text-gray-500">{profileData.email}</p>
        </div>
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">
            Details
          </h3>
          <ul className="mt-2 space-y-2 text-gray-700">
            <li>
              <span className="font-medium">Role:</span> {profileData.role}
            </li>
            <li>
              <span className="font-medium">Department:</span>{" "}
              {profileData.department}
            </li>
            <li>
              <span className="font-medium">Joined:</span>{" "}
              {profileData.createdAt}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminMyProfileClient;
