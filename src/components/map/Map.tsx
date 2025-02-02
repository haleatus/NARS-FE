"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Ambulance } from "@/core/types/ambulance.interface";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

interface MapProps {
  ambulanceData: Ambulance[];
  center: [number, number];
  initialZoom: number;
  userLocation?: [number, number];
  showRouteToAmbulance?: string;
}

const Map: React.FC<MapProps> = ({
  ambulanceData,
  center,
  initialZoom,
  userLocation = [85.333606, 27.705665],
  showRouteToAmbulance,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const routeLayer = useRef<string | null>(null);
  const routeSource = useRef<string | null>(null);

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
          "line-color": "#3b82f6",
          "line-width": 4,
          "line-opacity": 0.75,
        },
      });

      routeSource.current = sourceId;
      routeLayer.current = layerId;

      // Fit bounds to show the entire route
      const coordinates = route;
      const bounds = coordinates.reduce(
        (bounds: mapboxgl.LngLatBounds, coord: number[]) => {
          return bounds.extend(coord as mapboxgl.LngLatLike);
        },
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
      );

      map.current.fitBounds(bounds, {
        padding: 50,
      });
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add user location marker
    const userEl = document.createElement("div");
    userEl.className = "user-marker";
    userEl.style.width = "21px";
    userEl.style.height = "21px";
    userEl.style.backgroundImage = "url(/user-location.svg)"; // Add this icon to your public folder
    userEl.style.backgroundSize = "cover";

    new mapboxgl.Marker(userEl)
      .setLngLat(userLocation)
      .setPopup(
        new mapboxgl.Popup().setHTML("<div class='p-2'>Your Location</div>")
      )
      .addTo(map.current);

    // Add ambulance markers
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

      // Draw route if this is the selected ambulance
      if (showRouteToAmbulance === ambulance._id) {
        drawRoute(userLocation, [
          parseFloat(ambulance.location.longitude),
          parseFloat(ambulance.location.latitude),
        ]);
      }
    });
  }, [ambulanceData, showRouteToAmbulance, userLocation]);

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
        .user-marker {
          background-color: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
        }
      `}</style>
    </>
  );
};

export default Map;
