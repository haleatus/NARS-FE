/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const BAGMATI_BOUNDS: [[number, number], [number, number]] = [
  [83.7439, 27.2324],
  [86.2362, 28.218],
];

interface MapProps {
  center: [number, number];
  initialZoom: number;
  showMultiRoute?: {
    ambulanceLocation: [number, number];
    userLocation: [number, number];
    hospitalLocation: [number, number];
  };
}

const AmbulanceMap: React.FC<MapProps> = ({
  center,
  initialZoom,
  showMultiRoute,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const routeLayers = useRef<string[]>([]);
  const routeSources = useRef<string[]>([]);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: center,
      maxBounds: BAGMATI_BOUNDS,
      zoom: initialZoom,
      minZoom: 6,
    });

    const nav = new mapboxgl.NavigationControl();
    map.current.addControl(nav, "top-right");

    return () => {
      map.current?.remove();
    };
  }, []);

  const clearExistingMarkers = () => {
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];
  };

  const clearExistingRoutes = () => {
    if (!map.current) return;

    routeLayers.current.forEach((layerId) => {
      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId);
      }
    });

    routeSources.current.forEach((sourceId) => {
      if (map.current?.getSource(sourceId)) {
        map.current.removeSource(sourceId);
      }
    });

    routeLayers.current = [];
    routeSources.current = [];
  };

  const createMarker = (
    coordinates: [number, number],
    type: "ambulance" | "user" | "hospital"
  ) => {
    if (!map.current) return;

    const el = document.createElement("div");
    el.className = `marker ${type}-marker`;

    // Style the marker based on type
    const size = "30px";
    el.style.width = size;
    el.style.height = size;
    el.style.backgroundSize = "cover";
    el.style.cursor = "pointer";

    // Set different icons and colors for each type
    switch (type) {
      case "ambulance":
        el.style.backgroundImage = "url('/Vector.svg')";
        break;
      case "user":
        el.style.backgroundImage = "url('/user-location.svg')";
        break;
      case "hospital":
        el.style.backgroundImage = "url('/hospital-icon.svg')";
        break;
    }

    // Create popup content based on type
    const popupContent = {
      ambulance: "Ambulance Location",
      user: "Patient Location",
      hospital: "Hospital Location",
    };

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<div class="p-2 font-semibold">${popupContent[type]}</div>`
    );

    const marker = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map.current);

    markers.current.push(marker);
  };

  const drawMultiRoute = async (
    ambulanceLoc: [number, number],
    userLoc: [number, number],
    hospitalLoc: [number, number]
  ) => {
    if (!map.current) return;

    clearExistingRoutes();
    clearExistingMarkers();

    try {
      // Draw route from ambulance to user (Emergency route)
      const ambulanceToUserRoute = await fetchRoute(ambulanceLoc, userLoc);
      drawRouteSegment(
        ambulanceToUserRoute,
        "route-ambulance-user",
        "#dc2626", // Red color for emergency pickup route
        8 // Thicker line for emphasis
      );

      // Draw route from user to hospital (Hospital route)
      const userToHospitalRoute = await fetchRoute(userLoc, hospitalLoc);
      drawRouteSegment(
        userToHospitalRoute,
        "route-user-hospital",
        "#2563eb", // Blue color for hospital route
        6
      );

      // Add markers
      createMarker(ambulanceLoc, "ambulance");
      createMarker(userLoc, "user");
      createMarker(hospitalLoc, "hospital");

      // Fit bounds to include all points
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(ambulanceLoc);
      bounds.extend(userLoc);
      bounds.extend(hospitalLoc);

      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 15,
      });
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const fetchRoute = async (start: [number, number], end: [number, number]) => {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
    );
    const json = await query.json();
    return json.routes[0].geometry.coordinates;
  };

  const drawRouteSegment = (
    coordinates: number[][],
    id: string,
    color: string,
    width: number = 4
  ) => {
    if (!map.current) return;

    const sourceId = `${id}-source`;
    const layerId = `${id}-layer`;

    map.current.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates,
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
        "line-color": color,
        "line-width": width,
        "line-opacity": 0.75,
      },
    });

    routeSources.current.push(sourceId);
    routeLayers.current.push(layerId);
  };

  useEffect(() => {
    if (!map.current || !showMultiRoute) return;

    drawMultiRoute(
      showMultiRoute.ambulanceLocation,
      showMultiRoute.userLocation,
      showMultiRoute.hospitalLocation
    );
  }, [showMultiRoute]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .marker {
          transition: transform 0.2s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .marker:hover {
          transform: scale(1.1);
        }
        .ambulance-marker {
          background-color: #dc2626;
        }
        .user-marker {
          background-color: #3b82f6;
        }
        .hospital-marker {
          background-color: #059669;
        }
      `}</style>
    </div>
  );
};

export default AmbulanceMap;
