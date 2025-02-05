"use client";

import { AmbulanceCardsCarousel } from "@/components/home/ambulance-card-carousel";
import { useAdmin } from "@/context/admin-context";
import { useAmbulance } from "@/context/ambulance-context";
import { useUser } from "@/context/user-context";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function HomeClient() {
  const { user } = useUser();
  const { ambulance } = useAmbulance();
  const { admin } = useAdmin();

  const [displayName, setDisplayName] = useState<string>("Guest");

  useEffect(() => {
    if (user) {
      setDisplayName(user.fullname);
    } else if (ambulance) {
      setDisplayName(ambulance.driver_name);
    } else if (admin) {
      setDisplayName(admin.username);
    }
  }, [user, ambulance, admin]); // Only runs when any of these values change

  return (
    <div className="container mx-auto p-4 space-y-8 font-sans scroll-smooth [scrollbar-width:none]">
      {/* Main Content */}
      <main className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold mb-2">
              Welcome {displayName}!
            </h1>
            <p className="text-gray-600">
              Find the closest ambulance available.
            </p>
          </div>

          <div className="h-[420px]">
            <AmbulanceCardsCarousel />
          </div>
        </div>

        <div className="relative lg:flex order-first lg:order-last">
          <Image
            src="/home/Home.svg"
            alt="Emergency Services Illustration"
            width={460}
            height={460}
            className="w-full h-[260px] md:h-[460px]"
          />
        </div>
      </main>
    </div>
  );
}
