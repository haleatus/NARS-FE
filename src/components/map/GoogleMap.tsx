/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Ambulance } from "@/core/interface/ambulance.interface";

interface MapComponentProps {
  apiKey: string;
  ambulances?: Ambulance[];
}

interface Location {
  lat: number;
  lng: number;
  title: string;
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const GoogleMap: React.FC<MapComponentProps> = ({
  apiKey,
  ambulances = [],
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(
    null
  );
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const [ambulanceMarkers, setAmbulanceMarkers] = useState<
    google.maps.Marker[]
  >([]);

  // Initialize map
  const initializeMap = (): void => {
    if (!mapRef.current || map) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 40.7128, lng: -74.006 },
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    setMap(mapInstance);

    // Initialize search box
    const input = document.createElement("input");
    input.placeholder = "Search for places...";
    input.className =
      "map-search-input bg-white px-4 py-2 rounded-lg shadow-md w-72";
    input.style.margin = "10px";
    input.style.position = "absolute";
    input.style.top = "0";
    input.style.left = "0";
    input.style.zIndex = "1";

    mapInstance.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    const searchBoxInstance = new google.maps.places.SearchBox(input);
    setSearchBox(searchBoxInstance);

    // Listen for search box changes
    searchBoxInstance.addListener("places_changed", () => {
      const places = searchBoxInstance.getPlaces();
      if (!places || places.length === 0) return;

      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) return;

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      mapInstance.fitBounds(bounds);
    });
  };

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps) {
        initializeMap();
        return;
      }

      window.initMap = initializeMap;

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      markers.forEach((marker) => marker.setMap(null));
      ambulanceMarkers.forEach((marker) => marker.setMap(null));
      if (userMarker) userMarker.setMap(null);
    };
  }, [apiKey]);

  // Get user's location
  const getUserLocation = () => {
    if (!map || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        setUserLocation(userPos);

        // Remove existing user marker
        if (userMarker) userMarker.setMap(null);

        // Create new user marker
        const marker = new google.maps.Marker({
          position: userPos,
          map: map,
          title: "Your Location",
          icon: {
            url: "/user-location.svg",
            scaledSize: new google.maps.Size(32, 32),
          },
        });

        setUserMarker(marker);
        map.setCenter(userPos);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  };

  // Update ambulance markers
  useEffect(() => {
    if (!map) return;

    // Clear existing ambulance markers
    ambulanceMarkers.forEach((marker) => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    ambulances.forEach((ambulance) => {
      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(ambulance.location.latitude),
          lng: parseFloat(ambulance.location.longitude),
        },
        map: map,
        icon: {
          url: "/ambulance-icon.svg",
          scaledSize: new google.maps.Size(32, 32),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
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
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map: map,
        });
      });

      newMarkers.push(marker);
    });

    setAmbulanceMarkers(newMarkers);
  }, [ambulances, map]);

  return (
    <Card className="p-4 w-full max-w-4xl mx-auto relative">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Google Maps</h2>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={getUserLocation}
          >
            Get My Location
          </button>
        </div>

        <div ref={mapRef} className="w-full h-96 rounded-lg overflow-hidden" />
      </div>

      <style jsx global>{`
        .map-search-input {
          font-family: system-ui, sans-serif;
          font-size: 14px;
        }
        .map-search-input:focus {
          outline: 2px solid #3b82f6;
        }
      `}</style>
    </Card>
  );
};

export default GoogleMap;
