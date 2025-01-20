"use client";

import { User } from "@/core/types/user/user.interface";
import React from "react";
import { Card, CardContent } from "../ui/card";

const GetAllUsersClient = ({ usersData }: { usersData: User[] }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">User Showcase</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usersData.map((user) => (
          <Card key={user._id} className="overflow-hidden">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">{user.fullname}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Contact:</span> {user.contact}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GetAllUsersClient;
