/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Ambulance } from "@/core/types/ambulance.interface";
import { IHospital } from "@/core/types/hospital.interface";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

// Nepal bounds coordinates
// const NEPAL_BOUNDS: [[number, number], [number, number]] = [
//   [80.0884, 26.3478], // Southwest coordinates
//   [88.2039, 30.4227], // Northeast coordinates
// ];

const BAGMATI_BOUNDS: [[number, number], [number, number]] = [
  [83.7439, 27.2324], // Southwest coordinates (approx.)
  [86.2362, 28.218], // Northeast coordinates (approx.)
];

interface MapProps {
  ambulanceData: Ambulance[];
  center: [number, number];
  initialZoom: number;
  userLocation?: [number, number];
  showRouteToAmbulance?: string;
  selectedHospital: IHospital | null;
  showRouteToHospital?: boolean;
}

const Map: React.FC<MapProps> = ({
  ambulanceData,
  center,
  initialZoom,
  userLocation = [85.333606, 27.705665],
  showRouteToAmbulance,
  selectedHospital,
  showRouteToHospital,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const routeLayer = useRef<string | null>(null);
  const routeSource = useRef<string | null>(null);

  const hospitalMarker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: center,
      maxBounds: BAGMATI_BOUNDS, // Restrict map panning to Bagmati Province
      zoom: initialZoom,
      minZoom: 6, // Set minimum zoom level
    });

    const nav = new mapboxgl.NavigationControl();
    map.current.addControl(nav, "top-right");

    return () => {
      map.current?.remove();
    };
  }, []);

  // Function to draw route
  const drawRoute = async (start: [number, number], end: [number, number]) => {
    if (!map.current) return;

    // Remove existing route if any
    if (routeLayer.current && routeSource.current) {
      if (map.current.getLayer(routeLayer.current)) {
        map.current.removeLayer(routeLayer.current);
      }
      if (map.current.getSource(routeSource.current)) {
        map.current.removeSource(routeSource.current);
      }
    }

    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      const sourceId = `route-${Date.now()}`;
      const layerId = `route-layer-${Date.now()}`;

      map.current.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route,
          },
        },
      });

      map.current.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ef4444",
          "line-width": 4,
          "line-opacity": 0.75,
        },
      });

      routeSource.current = sourceId;
      routeLayer.current = layerId;

      const coordinates = route;
      const bounds = coordinates.reduce(
        (bounds: mapboxgl.LngLatBounds, coord: number[]) => {
          return bounds.extend(coord as mapboxgl.LngLatLike);
        },
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
      );

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15, // Limit maximum zoom when fitting bounds
      });
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  useEffect(() => {
    if (!map.current || !selectedHospital) return;

    // Clear existing hospital marker
    if (hospitalMarker.current) {
      hospitalMarker.current.remove();
    }

    const el = document.createElement("div");
    el.className = "hospital-marker";
    el.style.width = "24px";
    el.style.height = "24px";
    el.style.backgroundImage = "url(/hospital-icon.svg)";
    el.style.backgroundSize = "cover";
    el.style.cursor = "pointer";

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div class="p-3 max-w-xs">
        <h3 class="font-semibold text-lg mb-2">${selectedHospital.name}</h3>
      </div>
    `);

    hospitalMarker.current = new mapboxgl.Marker(el)
      .setLngLat([selectedHospital.longitude, selectedHospital.latitude])
      .setPopup(popup)
      .addTo(map.current);

    map.current.flyTo({
      center: [selectedHospital.longitude, selectedHospital.latitude],
      zoom: 15,
      duration: 1000,
    });

    if (showRouteToHospital && userLocation) {
      drawRoute(userLocation, [
        selectedHospital.longitude,
        selectedHospital.latitude,
      ]);
    }
  }, [selectedHospital, showRouteToHospital]);

  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    const userEl = document.createElement("div");
    userEl.className = "user-marker";
    userEl.style.width = "21px";
    userEl.style.height = "21px";
    userEl.style.backgroundImage = "url(/user-location.svg)";
    userEl.style.backgroundSize = "cover";

    new mapboxgl.Marker(userEl)
      .setLngLat(userLocation)
      .setPopup(
        new mapboxgl.Popup().setHTML("<div class='p-2'>Your Location</div>")
      )
      .addTo(map.current);

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

      if (showRouteToAmbulance === ambulance._id) {
        drawRoute(userLocation, [
          parseFloat(ambulance.location.longitude),
          parseFloat(ambulance.location.latitude),
        ]);
      }
    });
  }, [ambulanceData, showRouteToAmbulance, userLocation]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .marker,
        .hospital-marker {
          transition: transform 0.2s;
        }
        .marker:hover,
        .hospital-marker:hover {
          transform: scale(1.1);
        }
        .user-marker {
          background-color: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Map;
