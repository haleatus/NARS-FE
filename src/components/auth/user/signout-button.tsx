"use client";

import { userSignOut } from "@/app/actions/auth/user.action";
import { useRouter } from "next/navigation";

import React from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { IoMdLogOut } from "react-icons/io";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { useUser } from "@/context/user-context";
import { useAdmin } from "@/context/admin-context";
import { useAmbulance } from "@/context/ambulance-context";

const SignoutButton = () => {
  const router = useRouter();

  const { refetchAdmin } = useAdmin();
  const { refetchUser } = useUser();
  const { refetchAmbulance } = useAmbulance();

  const handleSignOut = async () => {
    const result = await userSignOut();
    if (result.success) {
      // Refetch user data and update context
      await refetchUser();
      await refetchAdmin();
      await refetchAmbulance();
      toast.success("Sign out successful! Redirecting...");
      router.replace("/"); // Replace history
      window.location.reload(); // Force reload to reset UI
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
          <span className="text-red-600">User SignOut</span>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default SignoutButton;
