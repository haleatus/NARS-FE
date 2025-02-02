"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Ambulance } from "@/core/types/ambulance.interface";

// Replace with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

interface MapProps {
  ambulanceData: Ambulance[];
  center: [number, number];
  initialZoom: number;
}

const Map: React.FC<MapProps> = ({ ambulanceData, center, initialZoom }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/navigation-day-v1",
      center: center,
      zoom: initialZoom,
    });

    const nav = new mapboxgl.NavigationControl();
    map.current.addControl(nav, "top-right");

    return () => {
      map.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers for each ambulance
    ambulanceData.forEach((ambulance) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.width = "21px";
      el.style.height = "21px";
      el.style.backgroundImage = "url(/Vector.svg)";
      el.style.backgroundSize = "cover";
      el.style.cursor = "pointer";

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-3 max-w-xs">
          <h3 class="font-semibold text-lg mb-2">${ambulance.driver_name}</h3>
          <p class="text-sm mb-1">
            <span class="font-medium">Status:</span> 
            <span class="px-2 py-1 rounded ${
              ambulance.status === "AVAILABLE"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }">
              ${ambulance.status}
            </span>
          </p>
          <p class="text-sm mb-1">
            <span class="font-medium">Number:</span> 
            ${ambulance.ambulance_number}
          </p>
          <p class="text-sm">
            <span class="font-medium">Contact:</span> 
            ${ambulance.contact}
          </p>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([
          parseFloat(ambulance.location.longitude),
          parseFloat(ambulance.location.latitude),
        ])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [ambulanceData]);

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .marker {
          transition: transform 0.2s;
        }
        .marker:hover {
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
};

export default Map;
