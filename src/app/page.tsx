import { EmergencyButton } from "@/components/emergency/emergency-button";
import { AmbulanceCardsCarousel } from "@/components/home/ambulance-card-carousel";
import { MapPinIcon } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto p-4 space-y-8 font-sans scroll-smooth [scrollbar-width:none]">
      <div className="flex items-center justify-end">
        <div className="bg-red-600 backdrop-blur-sm flex items-center gap-2 px-2 py-1 rounded-full shadow-sm text-white">
          <MapPinIcon className="h-4 w-4 text-white" />
          <span>Your Location</span>
        </div>
      </div>
      <div className="fixed bottom-4 right-8 flex justify-center items-center flex-col z-50">
        <EmergencyButton />
      </div>
      {/* Main Content */}
      <main className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Welcome Satkar</h1>
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
            className="w-full h-[460px]"
          />
        </div>
      </main>
    </div>
  );
}
