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
            <TableHead className="text-center">Full Name</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Contact</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersData.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium text-center">
                <div className="flex items-center justify-center">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {user.fullname}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center">
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
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center">
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
