"use client";

import { useEffect, useState } from "react";

interface MapViewProps {
  className?: string;
}

export function MapView({ className }: MapViewProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={className}>
      {isLoading ? (
        <div className="h-full w-full animate-pulse bg-muted" />
      ) : (
        <div className="h-full w-full bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">
            Map View (Integration Required)
          </p>
        </div>
      )}
    </div>
  );
}
