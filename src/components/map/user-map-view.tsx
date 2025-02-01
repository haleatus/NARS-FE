"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Ambulance } from "@/core/types/ambulance.interface";

interface MapViewProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  ambulanceData: Ambulance[];
}

const UserMapView: React.FC<MapViewProps> = ({
  className,
  initialCenter = [85.3294567, 27.7363983], // Centered on Nepal
  initialZoom = 12,
  ambulanceData,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  //   const user = useUser();
  //   const userLocation = user?.location
  //     ? [user.location.longitude, user.location.latitude]
  //     : null;

  //   const userLocation = [85.3294567, 27.7363983];

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env
      .NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenter,
      zoom: initialZoom,
      maxZoom: 18,
      minZoom: 2,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      if (map.current) {
        map.current.remove();
      }
    };
  }, [initialCenter, initialZoom]);

  // Add/Update ambulance markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const userLocation = [85.333767, 27.705747];

    ambulanceData.forEach((ambulance) => {
      const { longitude, latitude } = ambulance.location;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "ambulance-marker";
      el.innerHTML = `
        <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM3 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm10 0a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5z"/>
          </svg>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${ambulance.driver_name}</h3>
          <p class="text-sm">Plate: ${ambulance.ambulance_number}</p>
          <p class="text-sm">Contact: ${ambulance.contact}</p>
          ${
            userLocation
              ? `
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&origin=${userLocation[1]},${userLocation[0]}&destination=${latitude},${longitude}&travelmode=driving')" 
              class="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors">
              Show Route
            </button>
          `
              : ""
          }
        </div>
      `);

      // Create and store marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([parseFloat(longitude), parseFloat(latitude)])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current[ambulance._id] = marker;
    });
  }, [ambulanceData]);

  return (
    <>
      <div ref={mapContainer} className={className} />
      <style jsx global>{`
        .ambulance-marker {
          cursor: pointer;
        }
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

export default UserMapView;
