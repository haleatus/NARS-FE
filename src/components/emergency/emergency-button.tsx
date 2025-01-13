"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle, Ambulance, Phone, MapPin } from "lucide-react";

export function EmergencyButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleEmergencyRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.info("An ambulance has been dispatched to your location.");

    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full text-md p-2 shadow-lg md:pl-4">
          <Ambulance className="h-6 w-6" />
          <span className="md:flex hidden ml-2">
            Request Emergency Assistance
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary flex items-center gap-2">
            <AlertCircle className="h-6 w-6" />
            Emergency Assistance Request
          </DialogTitle>
          <DialogDescription>
            Please provide the following information for immediate assistance.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEmergencyRequest} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Full Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                placeholder="Enter your full name"
                required
                className="pl-10"
              />
              <AlertCircle className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base">
              Phone Number
            </Label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                required
                className="pl-10"
              />
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-base">
              Location Details
            </Label>
            <div className="relative">
              <Input
                id="location"
                placeholder="Enter additional location details"
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-destructive hover:bg-destructive/90 text-white py-6 text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </div>
            ) : (
              <>
                <Ambulance className="mr-2 h-5 w-5" />
                Confirm Emergency Request
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
