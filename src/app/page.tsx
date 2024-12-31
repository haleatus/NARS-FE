import { EmergencyButton } from "@/components/emergency/emergency-button";
import { MapView } from "@/components/map/map-view";
import { Ambulance, Phone, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent">
      <div className="container mx-auto p-4 space-y-8">
        <section className="text-center space-y-6 py-12">
          <div className="inline-block animate-bounce mb-4">
            <Ambulance className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Nearest Ambulance Response System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quick emergency response when every second counts
          </p>
          <EmergencyButton />
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 shadow-lg border-2 border-primary/10 flex flex-col items-center text-center space-y-2">
            <Ambulance className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold text-lg">Fast Response</h3>
            <p className="text-muted-foreground">
              Immediate dispatch of nearest available ambulance
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-lg border-2 border-primary/10 flex flex-col items-center text-center space-y-2">
            <Phone className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold text-lg">Easy Contact</h3>
            <p className="text-muted-foreground">
              Simple one-click emergency assistance request
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-lg border-2 border-primary/10 flex flex-col items-center text-center space-y-2">
            <Clock className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold text-lg">Real-time Tracking</h3>
            <p className="text-muted-foreground">
              Monitor ambulance location and estimated arrival time
            </p>
          </div>
        </section>

        <section className="rounded-lg border-2 border-primary/10 bg-card p-6 space-y-4 shadow-lg">
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Ambulance className="h-6 w-6" />
            Nearby Ambulances
          </h2>
          <MapView className="h-[400px] w-full rounded-md" />
        </section>
      </div>
    </div>
  );
}
