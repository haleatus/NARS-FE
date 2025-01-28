"use client";

import { useRouter } from "next/navigation";

import React from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { IoMdLogOut } from "react-icons/io";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { ambulanceSignOut } from "@/app/actions/auth/ambulance.action";
import { useAmbulance } from "@/context/ambulance-context";
import { useAdmin } from "@/context/admin-context";
import { useUser } from "@/context/user-context";

const AmbulanceSignoutButton = () => {
  const router = useRouter();

  const { refetchAdmin } = useAdmin();
  const { refetchUser } = useUser();
  const { refetchAmbulance } = useAmbulance();

  const handleSignOut = async () => {
    const result = await ambulanceSignOut();
    if (result.success) {
      // Refetch ambulance data and update context
      await refetchAmbulance();
      await refetchUser();
      await refetchAdmin();
      toast.success("Sign out successful! Redirecting...");
      // Redirect to login page or update UI
      router.push("/ambulance-signin");
    } else {
      // Handle error
      toast.error(result.error?.message);
    }
  };
  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleSignOut}
            className="bg-red-200 text-black hover:text-white rounded-full size-7 p-0.5 hover:bg-red-800 transition-colors duration-300"
          >
            <IoMdLogOut size={22} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-red-600">Ambulance SignOut</span>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default AmbulanceSignoutButton;
