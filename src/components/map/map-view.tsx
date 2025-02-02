"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapViewProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

const MapView: React.FC<MapViewProps> = ({
  className,
  initialCenter = [-74.5, 40], // Default to New York area
  initialZoom = 9,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Replace with your actual Mapbox access token
    mapboxgl.accessToken = process.env
      .NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

    if (map.current) return; // Initialize map only once

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

    // Add user location control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    // Error handling for map load
    map.current.on("error", (e: mapboxgl.ErrorEvent) => {
      console.error("Mapbox error:", e.error);
    });

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [initialCenter, initialZoom]);

  return <div ref={mapContainer} className={className} />;
};

export default MapView;
