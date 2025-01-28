"use client";

import React from "react";
import type { User } from "@/core/types/user/user.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail, Phone, UserIcon, Info } from "lucide-react";
import Link from "next/link";

const GetAllUsersClient = ({ usersData }: { usersData: User[] }) => {
  return (
    <div className="container mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-1/4">Full Name</TableHead>
            <TableHead className="text-center w-1/3">Email</TableHead>
            <TableHead className="text-center w-1/4">Contact</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersData.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium text-center border-r border-gray-300">
                <div className="flex items-center ">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {user.fullname}
                </div>
              </TableCell>
              <TableCell className="border-r border-gray-300">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {user.email}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send email to {user.fullname}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="border-r border-gray-300">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center ">
                        <Phone className="w-4 h-4 mr-2" />
                        {user.contact}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Call {user.fullname}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        // href={`/users/${user._id}`}
                        href={`#`}
                        className="text-blue-500 hover:text-blue-700 transition-colors flex justify-center items-center"
                      >
                        <Info className="w-5 h-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View User Details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GetAllUsersClient;
