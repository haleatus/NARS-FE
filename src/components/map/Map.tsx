/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Ambulance } from "@/core/types/ambulance.interface";
import { IHospital } from "@/core/types/hospital.interface";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

interface MapProps {
  ambulanceData: Ambulance[];
  center: [number, number];
  initialZoom: number;
  userLocation?: [number, number];
  showRouteToAmbulance?: string;
  hospitalData: IHospital[] | null;
}

const Map: React.FC<MapProps> = ({
  ambulanceData,
  center,
  initialZoom,
  userLocation = [85.333606, 27.705665],
  showRouteToAmbulance,
  hospitalData,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const routeLayer = useRef<string | null>(null);
  const routeSource = useRef<string | null>(null);
  const [showHospitalList, setShowHospitalList] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<IHospital | null>(
    null
  );
  const hospitalMarkers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
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

  const addHospitalMarkers = () => {
    if (!map.current || !hospitalData) return;

    // Clear existing hospital markers
    hospitalMarkers.current.forEach((marker) => marker.remove());
    hospitalMarkers.current = [];

    hospitalData.forEach((hospital) => {
      const el = document.createElement("div");
      el.className = "hospital-marker";
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.backgroundImage = "url(/hospital-icon.svg)";
      el.style.backgroundSize = "cover";
      el.style.cursor = "pointer";

      const isSelected = selectedHospital?.name === hospital.name;
      if (isSelected) {
        el.style.transform = "scale(1.2)";
        el.style.border = "2px solid #3b82f6";
        el.style.borderRadius = "50%";
      }

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-3 max-w-xs">
          <h3 class="font-semibold text-lg mb-2">${hospital.name}</h3>
          
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([hospital.longitude, hospital.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      hospitalMarkers.current.push(marker);
    });
  };

  useEffect(() => {
    addHospitalMarkers();
  }, [hospitalData, selectedHospital]);

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

  const handleHospitalClick = (hospital: IHospital) => {
    setSelectedHospital(hospital);
    if (map.current) {
      map.current.flyTo({
        center: [hospital.longitude, hospital.latitude],
        zoom: 15,
        duration: 1000,
      });
    }
  };

  const HospitalList = () => (
    <div className="relative">
      <button
        onClick={() => setShowHospitalList(!showHospitalList)}
        className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-l shadow-md z-10"
      >
        {showHospitalList ? (
          <ChevronRight size={20} />
        ) : (
          <ChevronLeft size={20} />
        )}
      </button>

      {showHospitalList && (
        <Card className="w-60 h-full">
          <CardHeader>
            <CardTitle>Nearby Hospitals</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[calc(100%-4rem)] px-2">
            <CardContent>
              {Array.isArray(hospitalData) && hospitalData.length > 0 ? (
                hospitalData.map((hospital, index) => (
                  <div
                    key={index}
                    className={`p-2 border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedHospital?.name === hospital.name
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleHospitalClick(hospital)}
                  >
                    <h3 className="font-semibold text-sm">{hospital.name}</h3>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No hospitals found
                </div>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      )}
    </div>
  );

  return (
    <div className="flex w-full h-full gap-4">
      <div ref={mapContainer} className="flex-1 h-full" />
      <HospitalList />
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
        .hospital-marker {
          transition: all 0.2s;
        }
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
