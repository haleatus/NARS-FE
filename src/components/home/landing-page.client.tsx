"use client";

import { useAdmin } from "@/context/admin-context";
import { useAmbulance } from "@/context/ambulance-context";
import { useUser } from "@/context/user-context";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Phone, Clock, MapPin, Users } from "lucide-react";

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
  }, [user, ambulance, admin]);

  return (
    <div className="font-sans scroll-smooth [scrollbar-width:none]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-4 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Welcome {displayName}!
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              NARS - Your trusted partner in emergency medical services. Quick,
              reliable, and always there when you need us.
            </p>
          </div>
          <div className="relative">
            <Image
              src="/home/Home.svg"
              alt="Emergency Services Illustration"
              width={600}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose NARS?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center space-y-4">
              <Clock className="w-12 h-12 mx-auto text-red-600" />
              <h3 className="text-xl font-semibold">24/7 Service</h3>
              <p className="text-gray-600">
                Available round the clock for your emergency needs
              </p>
            </Card>
            <Card className="p-6 text-center space-y-4">
              <MapPin className="w-12 h-12 mx-auto text-red-600" />
              <h3 className="text-xl font-semibold">Quick Response</h3>
              <p className="text-gray-600">
                Fast and efficient emergency response system
              </p>
            </Card>
            <Card className="p-6 text-center space-y-4">
              <Users className="w-12 h-12 mx-auto text-red-600" />
              <h3 className="text-xl font-semibold">Expert Team</h3>
              <p className="text-gray-600">
                Highly trained medical professionals
              </p>
            </Card>
            <Card className="p-6 text-center space-y-4">
              <Phone className="w-12 h-12 mx-auto text-red-600" />
              <h3 className="text-xl font-semibold">Easy Access</h3>
              <p className="text-gray-600">
                Simple booking process for immediate assistance
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">About NARS</h2>
            <p className="text-gray-600 leading-relaxed">
              NARS is dedicated to providing fast and reliable emergency medical
              services to those in need. Our mission is to ensure that quality
              healthcare is accessible to everyone, whenever they need it.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With our network of trained professionals and modern ambulances,
              we strive to deliver the best possible care during emergencies.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-100 p-6 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-red-600 mb-2">100+</h3>
              <p className="text-gray-600">Ambulances</p>
            </div>
            <div className="bg-red-100 p-6 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-red-600 mb-2">1000+</h3>
              <p className="text-gray-600">Lives Saved</p>
            </div>
            <div className="bg-red-100 p-6 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-red-600 mb-2">24/7</h3>
              <p className="text-gray-600">Support</p>
            </div>
            <div className="bg-red-100 p-6 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-red-600 mb-2">50+</h3>
              <p className="text-gray-600">Cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-4">
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} NARS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
