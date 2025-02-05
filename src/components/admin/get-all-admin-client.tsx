"use client";

import React from "react";
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
import { Mail, UserIcon } from "lucide-react";
import { Admin } from "@/core/interface/admin.interface";

const GetAllAdminClient = ({ adminsData }: { adminsData: Admin[] }) => {
  return (
    <div className="container mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Username</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminsData.map((admin) => (
            <TableRow key={admin._id}>
              <TableCell className="font-medium border-r border-gray-300">
                <div className="flex items-center justify-start">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {admin.username}
                </div>
              </TableCell>
              <TableCell className="border-r border-gray-300">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center ">
                        <Mail className="w-4 h-4 mr-2" />
                        {admin.email}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send email to {admin.email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="border-r border-gray-300">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center ">
                        <Mail className="w-4 h-4 mr-2" />
                        {admin.createdAt instanceof Date
                          ? admin.createdAt.toLocaleDateString()
                          : admin.createdAt}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Admin since{" "}
                        {admin.createdAt instanceof Date
                          ? admin.createdAt.toLocaleDateString()
                          : admin.createdAt}
                      </p>
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

export default GetAllAdminClient;
